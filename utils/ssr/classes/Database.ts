import { Pool, PoolConfig, types } from 'pg';
import KnexInstance, { Knex } from 'knex';

type DBType = 'varchar' | 'integer' | 'boolean' | 'json' | 'jsonb' | 'varchar[]' | 'integer[]' | 'boolean[]' | 'json[]' | 'jsonb[]';

type triggerEventProps = {
    event: string,
    data?: {[key: string]: any},
    user_id?: number,
    account_id: number,
    user?: string,
    object_type?: string,
    object_id?: number
}

export default class Database {
    pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
        types.setTypeParser(20, parseInt);
    }

    getKnexInstance() {
        return KnexInstance({
            client: 'pg'
        });
    }

    makeSubId(): string {
        let res = '';
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for(let i = 0; i < 16; i++)
            res += letters.charAt(Math.floor(Math.random() * letters.length))
        return res;
    }

    knex(tableName?: Knex.TableDescriptor): Knex.QueryBuilder<any, any> {
        return this.getKnexInstance()(tableName).connection(this.pool)
    }

    raw(value: Knex.Value): Knex.Raw {
        return this.getKnexInstance().raw(value);
    }

    subJson(callback: (knex: Knex) => Knex.QueryBuilder<any, any>): string {
        const cb = callback(this.getKnexInstance())
        const subid = this.makeSubId();
        return `SELECT row_to_json(${subid}) FROM (${cb.toQuery()}) ${subid}`;
    }

    subJsonArray(callback: (knex: Knex) => Knex.QueryBuilder<any, any>): string {
        const cb = callback(this.getKnexInstance())
        const subid = this.makeSubId();
        return `SELECT safe_json_array(array_agg(row_to_json(${subid}))) FROM (${cb.toQuery()}) ${subid}`;
    }

    selectSubJsonArray(callback: (knex: Knex) => Knex.QueryBuilder<any, any>, as: string): Knex.Raw<any> {
        return this.raw(`(${this.subJsonArray(callback)}) AS "${as.split('.').join(`"."`)}"`)
    }

    selectSubJson(callback: (knex: Knex) => Knex.QueryBuilder<any, any>, as: string): Knex.Raw<any> {
        return this.raw(`(${this.subJson(callback)}) AS "${as.split('.').join(`"."`)}"`)
    }

    async triggerEvent(props: triggerEventProps): Promise<number> {
        const event = await this.knex('events')
            .insert(props)
            .returning('id');
        return event[0].id;
    }
    
    async execute(sql: string, data: any[] = []): Promise<any> {
        sql = sql.replace(/\$[aA]/g, 'get_accountid()')
        sql = sql.replace(/\$[uU]/g, 'get_userid()')
        return await this.pool.query(sql, data);
    }

    async procedure(name: string, data: Array<{type?: DBType, value: any }> = []): Promise<void> {
        const plain_items: any[] = data.map(item => {
            if(typeof item === "object" && !Array.isArray(item) && typeof item.value !== "undefined")
                return item.value;
            return item;
        });
        await this.execute(`call ${name}(${data.map((item, key) => {
            if(typeof item === "object" && !Array.isArray(item) && typeof item.type !== "undefined")
                return `$${key + 1}::${item.type}`;
            return `$${key + 1}`
        }).join(', ')})`, plain_items)
    }

    async query(sql: string, data: any[] = []): Promise<any[]> {
        return (await this.execute(sql, data)).rows;
    }

    async first(sql: string, data: any[] = [], throwOnNotfound: boolean = true): Promise<any> {
        const result = await this.query(sql, data);
        if(result.length === 0){
            if(throwOnNotfound)
                throw 'No result';
            return null;
        }
        return result[0];
    }

    async end(): Promise<void> {
        return await this.pool.end();
    }
}

export { Knex } from 'knex';