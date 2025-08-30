import { DrizzlePropertyRepository } from "./repositories/DrizzlePropertyRepository";
import { AuthorizationService } from "./services/AuthorizationService";
import { PropertyService } from "./services/PropertyService";

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
		// Repositories
		const propertyRepository = new DrizzlePropertyRepository();

		// Services
		const authorizationService = new AuthorizationService();
		const propertyService = new PropertyService(
			propertyRepository,
			authorizationService,
		);

		// Register services
		this.services.set("propertyRepository", propertyRepository);
		this.services.set("authorizationService", authorizationService);
		this.services.set("propertyService", propertyService);
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

// Export typed getters for better DX
export const getPropertyService = () =>
	container.get<PropertyService>("propertyService");
export const getAuthorizationService = () =>
	container.get<AuthorizationService>("authorizationService");
export const getPropertyRepository = () =>
	container.get<DrizzlePropertyRepository>("propertyRepository");