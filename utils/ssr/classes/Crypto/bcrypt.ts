import { compare, hash } from 'bcrypt';

export default class Bcrypt {
    static async compare(plain: string, encrypted: string): Promise<boolean> {
        return await compare(`${plain}${process.env.APPLICATION_KEY}`, encrypted);
    }

    static async hash(plain: string, rounds: number = 14): Promise<string> {
        return await hash(`${plain}${process.env.APPLICATION_KEY}`, rounds);
    }

    static async fakeWait(rounds: number = 14): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, Math.pow(2, rounds) * 0.14921875));
    }
}