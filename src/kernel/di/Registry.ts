import { Constructor } from "@shared/types/Constructor";

export class Registry {
  private static instance: Registry | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() { }

  private readonly providers: Map<string, Registry.Provider> = new Map();

  register(impl: Constructor): void {
    const token = impl.name;

    if (this.providers.has(token)) {
      throw new Error(`Provider for ${token} already registered`);
    }

    const deps = Reflect.getMetadata("design:paramtypes", impl) ?? [];

    this.providers.set(token, { impl, deps });
  }

  resolve<TImpl extends Constructor>(constructor: TImpl): InstanceType<TImpl> {
    const token = constructor.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`Provider for ${token} not found`);
    }

    const deps = provider.deps.map((dep) => this.resolve(dep));

    return new provider.impl(...deps);
  }
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
  }
}
