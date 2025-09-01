class Container {
	private static instance: Container;
	private services = new Map<string, unknown>();

	private constructor() {
		this.setupServices();
	}

	static getInstance(): Container {
		if (!Container.instance) {
			Container.instance = new Container();
		}
		return Container.instance;
	}

	private setupServices(): void {
		// Services will be added here as needed
	}

	get<T>(serviceName: string): T {
		const service = this.services.get(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}
		return service as T;
	}
}

export const container = Container.getInstance();
