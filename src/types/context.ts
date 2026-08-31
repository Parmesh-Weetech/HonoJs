export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
};

export type AppEnv = {
    Variables: {
        user: AuthUser;
        sessionId: string;
    };
};