

export const getDomainByEnv = () => {
    switch (process.env.HOPS_ENV) {
        case "localhost":
            return 'localhost'
        case "test":
            return "iterapp.no"
    }
}