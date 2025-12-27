export type Scope = Record<string, any>;

export function createFrozenContext<T extends object>(input: T): Readonly<T> {
  return deepFreeze({ ...input });
}

function deepFreeze<T>(obj: T): T {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value: any = (obj as any)[prop];
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj);
}
