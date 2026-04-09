import nextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: int,
            username: string,
            email: string,
            name: string,
            rle: string,
            token: string,
            secret: string
        }
    }
}