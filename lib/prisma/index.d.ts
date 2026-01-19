
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model admin_operation_logs
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type admin_operation_logs = $Result.DefaultSelection<Prisma.$admin_operation_logsPayload>
/**
 * Model audit_logs
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type audit_logs = $Result.DefaultSelection<Prisma.$audit_logsPayload>
/**
 * Model feedbacks
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type feedbacks = $Result.DefaultSelection<Prisma.$feedbacksPayload>
/**
 * Model mail_histories
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type mail_histories = $Result.DefaultSelection<Prisma.$mail_historiesPayload>
/**
 * Model users
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admin_operation_logs
 * const admin_operation_logs = await prisma.admin_operation_logs.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Admin_operation_logs
   * const admin_operation_logs = await prisma.admin_operation_logs.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.admin_operation_logs`: Exposes CRUD operations for the **admin_operation_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admin_operation_logs
    * const admin_operation_logs = await prisma.admin_operation_logs.findMany()
    * ```
    */
  get admin_operation_logs(): Prisma.admin_operation_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.audit_logs`: Exposes CRUD operations for the **audit_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Audit_logs
    * const audit_logs = await prisma.audit_logs.findMany()
    * ```
    */
  get audit_logs(): Prisma.audit_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedbacks`: Exposes CRUD operations for the **feedbacks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedbacks.findMany()
    * ```
    */
  get feedbacks(): Prisma.feedbacksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mail_histories`: Exposes CRUD operations for the **mail_histories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mail_histories
    * const mail_histories = await prisma.mail_histories.findMany()
    * ```
    */
  get mail_histories(): Prisma.mail_historiesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    admin_operation_logs: 'admin_operation_logs',
    audit_logs: 'audit_logs',
    feedbacks: 'feedbacks',
    mail_histories: 'mail_histories',
    users: 'users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "admin_operation_logs" | "audit_logs" | "feedbacks" | "mail_histories" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      admin_operation_logs: {
        payload: Prisma.$admin_operation_logsPayload<ExtArgs>
        fields: Prisma.admin_operation_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.admin_operation_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.admin_operation_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          findFirst: {
            args: Prisma.admin_operation_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.admin_operation_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          findMany: {
            args: Prisma.admin_operation_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>[]
          }
          create: {
            args: Prisma.admin_operation_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          createMany: {
            args: Prisma.admin_operation_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.admin_operation_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>[]
          }
          delete: {
            args: Prisma.admin_operation_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          update: {
            args: Prisma.admin_operation_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          deleteMany: {
            args: Prisma.admin_operation_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.admin_operation_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.admin_operation_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>[]
          }
          upsert: {
            args: Prisma.admin_operation_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_operation_logsPayload>
          }
          aggregate: {
            args: Prisma.Admin_operation_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin_operation_logs>
          }
          groupBy: {
            args: Prisma.admin_operation_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Admin_operation_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.admin_operation_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Admin_operation_logsCountAggregateOutputType> | number
          }
        }
      }
      audit_logs: {
        payload: Prisma.$audit_logsPayload<ExtArgs>
        fields: Prisma.audit_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.audit_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.audit_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          findFirst: {
            args: Prisma.audit_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.audit_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          findMany: {
            args: Prisma.audit_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          create: {
            args: Prisma.audit_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          createMany: {
            args: Prisma.audit_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.audit_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          delete: {
            args: Prisma.audit_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          update: {
            args: Prisma.audit_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          deleteMany: {
            args: Prisma.audit_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.audit_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.audit_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          upsert: {
            args: Prisma.audit_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          aggregate: {
            args: Prisma.Audit_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAudit_logs>
          }
          groupBy: {
            args: Prisma.audit_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Audit_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.audit_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Audit_logsCountAggregateOutputType> | number
          }
        }
      }
      feedbacks: {
        payload: Prisma.$feedbacksPayload<ExtArgs>
        fields: Prisma.feedbacksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.feedbacksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.feedbacksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          findFirst: {
            args: Prisma.feedbacksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.feedbacksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          findMany: {
            args: Prisma.feedbacksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          create: {
            args: Prisma.feedbacksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          createMany: {
            args: Prisma.feedbacksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.feedbacksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          delete: {
            args: Prisma.feedbacksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          update: {
            args: Prisma.feedbacksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          deleteMany: {
            args: Prisma.feedbacksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.feedbacksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.feedbacksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          upsert: {
            args: Prisma.feedbacksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          aggregate: {
            args: Prisma.FeedbacksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedbacks>
          }
          groupBy: {
            args: Prisma.feedbacksGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbacksGroupByOutputType>[]
          }
          count: {
            args: Prisma.feedbacksCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbacksCountAggregateOutputType> | number
          }
        }
      }
      mail_histories: {
        payload: Prisma.$mail_historiesPayload<ExtArgs>
        fields: Prisma.mail_historiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.mail_historiesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.mail_historiesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          findFirst: {
            args: Prisma.mail_historiesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.mail_historiesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          findMany: {
            args: Prisma.mail_historiesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>[]
          }
          create: {
            args: Prisma.mail_historiesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          createMany: {
            args: Prisma.mail_historiesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.mail_historiesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>[]
          }
          delete: {
            args: Prisma.mail_historiesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          update: {
            args: Prisma.mail_historiesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          deleteMany: {
            args: Prisma.mail_historiesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.mail_historiesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.mail_historiesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>[]
          }
          upsert: {
            args: Prisma.mail_historiesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mail_historiesPayload>
          }
          aggregate: {
            args: Prisma.Mail_historiesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMail_histories>
          }
          groupBy: {
            args: Prisma.mail_historiesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Mail_historiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.mail_historiesCountArgs<ExtArgs>
            result: $Utils.Optional<Mail_historiesCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    admin_operation_logs?: admin_operation_logsOmit
    audit_logs?: audit_logsOmit
    feedbacks?: feedbacksOmit
    mail_histories?: mail_historiesOmit
    users?: usersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model admin_operation_logs
   */

  export type AggregateAdmin_operation_logs = {
    _count: Admin_operation_logsCountAggregateOutputType | null
    _min: Admin_operation_logsMinAggregateOutputType | null
    _max: Admin_operation_logsMaxAggregateOutputType | null
  }

  export type Admin_operation_logsMinAggregateOutputType = {
    id: string | null
    admin_id: string | null
    action_type: string | null
    user_id: string | null
    audit_id: string | null
    detail: string | null
    ip: string | null
    created_time: Date | null
  }

  export type Admin_operation_logsMaxAggregateOutputType = {
    id: string | null
    admin_id: string | null
    action_type: string | null
    user_id: string | null
    audit_id: string | null
    detail: string | null
    ip: string | null
    created_time: Date | null
  }

  export type Admin_operation_logsCountAggregateOutputType = {
    id: number
    admin_id: number
    action_type: number
    user_id: number
    audit_id: number
    detail: number
    ip: number
    created_time: number
    _all: number
  }


  export type Admin_operation_logsMinAggregateInputType = {
    id?: true
    admin_id?: true
    action_type?: true
    user_id?: true
    audit_id?: true
    detail?: true
    ip?: true
    created_time?: true
  }

  export type Admin_operation_logsMaxAggregateInputType = {
    id?: true
    admin_id?: true
    action_type?: true
    user_id?: true
    audit_id?: true
    detail?: true
    ip?: true
    created_time?: true
  }

  export type Admin_operation_logsCountAggregateInputType = {
    id?: true
    admin_id?: true
    action_type?: true
    user_id?: true
    audit_id?: true
    detail?: true
    ip?: true
    created_time?: true
    _all?: true
  }

  export type Admin_operation_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admin_operation_logs to aggregate.
     */
    where?: admin_operation_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_operation_logs to fetch.
     */
    orderBy?: admin_operation_logsOrderByWithRelationInput | admin_operation_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: admin_operation_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_operation_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_operation_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned admin_operation_logs
    **/
    _count?: true | Admin_operation_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Admin_operation_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Admin_operation_logsMaxAggregateInputType
  }

  export type GetAdmin_operation_logsAggregateType<T extends Admin_operation_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin_operation_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin_operation_logs[P]>
      : GetScalarType<T[P], AggregateAdmin_operation_logs[P]>
  }




  export type admin_operation_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: admin_operation_logsWhereInput
    orderBy?: admin_operation_logsOrderByWithAggregationInput | admin_operation_logsOrderByWithAggregationInput[]
    by: Admin_operation_logsScalarFieldEnum[] | Admin_operation_logsScalarFieldEnum
    having?: admin_operation_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Admin_operation_logsCountAggregateInputType | true
    _min?: Admin_operation_logsMinAggregateInputType
    _max?: Admin_operation_logsMaxAggregateInputType
  }

  export type Admin_operation_logsGroupByOutputType = {
    id: string
    admin_id: string
    action_type: string
    user_id: string | null
    audit_id: string | null
    detail: string | null
    ip: string | null
    created_time: Date | null
    _count: Admin_operation_logsCountAggregateOutputType | null
    _min: Admin_operation_logsMinAggregateOutputType | null
    _max: Admin_operation_logsMaxAggregateOutputType | null
  }

  type GetAdmin_operation_logsGroupByPayload<T extends admin_operation_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Admin_operation_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Admin_operation_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Admin_operation_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Admin_operation_logsGroupByOutputType[P]>
        }
      >
    >


  export type admin_operation_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    action_type?: boolean
    user_id?: boolean
    audit_id?: boolean
    detail?: boolean
    ip?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["admin_operation_logs"]>

  export type admin_operation_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    action_type?: boolean
    user_id?: boolean
    audit_id?: boolean
    detail?: boolean
    ip?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["admin_operation_logs"]>

  export type admin_operation_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    action_type?: boolean
    user_id?: boolean
    audit_id?: boolean
    detail?: boolean
    ip?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["admin_operation_logs"]>

  export type admin_operation_logsSelectScalar = {
    id?: boolean
    admin_id?: boolean
    action_type?: boolean
    user_id?: boolean
    audit_id?: boolean
    detail?: boolean
    ip?: boolean
    created_time?: boolean
  }

  export type admin_operation_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "action_type" | "user_id" | "audit_id" | "detail" | "ip" | "created_time", ExtArgs["result"]["admin_operation_logs"]>

  export type $admin_operation_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "admin_operation_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      admin_id: string
      action_type: string
      user_id: string | null
      audit_id: string | null
      detail: string | null
      ip: string | null
      created_time: Date | null
    }, ExtArgs["result"]["admin_operation_logs"]>
    composites: {}
  }

  type admin_operation_logsGetPayload<S extends boolean | null | undefined | admin_operation_logsDefaultArgs> = $Result.GetResult<Prisma.$admin_operation_logsPayload, S>

  type admin_operation_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<admin_operation_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Admin_operation_logsCountAggregateInputType | true
    }

  export interface admin_operation_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['admin_operation_logs'], meta: { name: 'admin_operation_logs' } }
    /**
     * Find zero or one Admin_operation_logs that matches the filter.
     * @param {admin_operation_logsFindUniqueArgs} args - Arguments to find a Admin_operation_logs
     * @example
     * // Get one Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends admin_operation_logsFindUniqueArgs>(args: SelectSubset<T, admin_operation_logsFindUniqueArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin_operation_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {admin_operation_logsFindUniqueOrThrowArgs} args - Arguments to find a Admin_operation_logs
     * @example
     * // Get one Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends admin_operation_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, admin_operation_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin_operation_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsFindFirstArgs} args - Arguments to find a Admin_operation_logs
     * @example
     * // Get one Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends admin_operation_logsFindFirstArgs>(args?: SelectSubset<T, admin_operation_logsFindFirstArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin_operation_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsFindFirstOrThrowArgs} args - Arguments to find a Admin_operation_logs
     * @example
     * // Get one Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends admin_operation_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, admin_operation_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admin_operation_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findMany()
     * 
     * // Get first 10 Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const admin_operation_logsWithIdOnly = await prisma.admin_operation_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends admin_operation_logsFindManyArgs>(args?: SelectSubset<T, admin_operation_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin_operation_logs.
     * @param {admin_operation_logsCreateArgs} args - Arguments to create a Admin_operation_logs.
     * @example
     * // Create one Admin_operation_logs
     * const Admin_operation_logs = await prisma.admin_operation_logs.create({
     *   data: {
     *     // ... data to create a Admin_operation_logs
     *   }
     * })
     * 
     */
    create<T extends admin_operation_logsCreateArgs>(args: SelectSubset<T, admin_operation_logsCreateArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admin_operation_logs.
     * @param {admin_operation_logsCreateManyArgs} args - Arguments to create many Admin_operation_logs.
     * @example
     * // Create many Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends admin_operation_logsCreateManyArgs>(args?: SelectSubset<T, admin_operation_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admin_operation_logs and returns the data saved in the database.
     * @param {admin_operation_logsCreateManyAndReturnArgs} args - Arguments to create many Admin_operation_logs.
     * @example
     * // Create many Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admin_operation_logs and only return the `id`
     * const admin_operation_logsWithIdOnly = await prisma.admin_operation_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends admin_operation_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, admin_operation_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin_operation_logs.
     * @param {admin_operation_logsDeleteArgs} args - Arguments to delete one Admin_operation_logs.
     * @example
     * // Delete one Admin_operation_logs
     * const Admin_operation_logs = await prisma.admin_operation_logs.delete({
     *   where: {
     *     // ... filter to delete one Admin_operation_logs
     *   }
     * })
     * 
     */
    delete<T extends admin_operation_logsDeleteArgs>(args: SelectSubset<T, admin_operation_logsDeleteArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin_operation_logs.
     * @param {admin_operation_logsUpdateArgs} args - Arguments to update one Admin_operation_logs.
     * @example
     * // Update one Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends admin_operation_logsUpdateArgs>(args: SelectSubset<T, admin_operation_logsUpdateArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admin_operation_logs.
     * @param {admin_operation_logsDeleteManyArgs} args - Arguments to filter Admin_operation_logs to delete.
     * @example
     * // Delete a few Admin_operation_logs
     * const { count } = await prisma.admin_operation_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends admin_operation_logsDeleteManyArgs>(args?: SelectSubset<T, admin_operation_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admin_operation_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends admin_operation_logsUpdateManyArgs>(args: SelectSubset<T, admin_operation_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admin_operation_logs and returns the data updated in the database.
     * @param {admin_operation_logsUpdateManyAndReturnArgs} args - Arguments to update many Admin_operation_logs.
     * @example
     * // Update many Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admin_operation_logs and only return the `id`
     * const admin_operation_logsWithIdOnly = await prisma.admin_operation_logs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends admin_operation_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, admin_operation_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin_operation_logs.
     * @param {admin_operation_logsUpsertArgs} args - Arguments to update or create a Admin_operation_logs.
     * @example
     * // Update or create a Admin_operation_logs
     * const admin_operation_logs = await prisma.admin_operation_logs.upsert({
     *   create: {
     *     // ... data to create a Admin_operation_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin_operation_logs we want to update
     *   }
     * })
     */
    upsert<T extends admin_operation_logsUpsertArgs>(args: SelectSubset<T, admin_operation_logsUpsertArgs<ExtArgs>>): Prisma__admin_operation_logsClient<$Result.GetResult<Prisma.$admin_operation_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admin_operation_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsCountArgs} args - Arguments to filter Admin_operation_logs to count.
     * @example
     * // Count the number of Admin_operation_logs
     * const count = await prisma.admin_operation_logs.count({
     *   where: {
     *     // ... the filter for the Admin_operation_logs we want to count
     *   }
     * })
    **/
    count<T extends admin_operation_logsCountArgs>(
      args?: Subset<T, admin_operation_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Admin_operation_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin_operation_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_operation_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Admin_operation_logsAggregateArgs>(args: Subset<T, Admin_operation_logsAggregateArgs>): Prisma.PrismaPromise<GetAdmin_operation_logsAggregateType<T>>

    /**
     * Group by Admin_operation_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_operation_logsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends admin_operation_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: admin_operation_logsGroupByArgs['orderBy'] }
        : { orderBy?: admin_operation_logsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, admin_operation_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdmin_operation_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the admin_operation_logs model
   */
  readonly fields: admin_operation_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for admin_operation_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__admin_operation_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the admin_operation_logs model
   */
  interface admin_operation_logsFieldRefs {
    readonly id: FieldRef<"admin_operation_logs", 'String'>
    readonly admin_id: FieldRef<"admin_operation_logs", 'String'>
    readonly action_type: FieldRef<"admin_operation_logs", 'String'>
    readonly user_id: FieldRef<"admin_operation_logs", 'String'>
    readonly audit_id: FieldRef<"admin_operation_logs", 'String'>
    readonly detail: FieldRef<"admin_operation_logs", 'String'>
    readonly ip: FieldRef<"admin_operation_logs", 'String'>
    readonly created_time: FieldRef<"admin_operation_logs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * admin_operation_logs findUnique
   */
  export type admin_operation_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter, which admin_operation_logs to fetch.
     */
    where: admin_operation_logsWhereUniqueInput
  }

  /**
   * admin_operation_logs findUniqueOrThrow
   */
  export type admin_operation_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter, which admin_operation_logs to fetch.
     */
    where: admin_operation_logsWhereUniqueInput
  }

  /**
   * admin_operation_logs findFirst
   */
  export type admin_operation_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter, which admin_operation_logs to fetch.
     */
    where?: admin_operation_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_operation_logs to fetch.
     */
    orderBy?: admin_operation_logsOrderByWithRelationInput | admin_operation_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admin_operation_logs.
     */
    cursor?: admin_operation_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_operation_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_operation_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admin_operation_logs.
     */
    distinct?: Admin_operation_logsScalarFieldEnum | Admin_operation_logsScalarFieldEnum[]
  }

  /**
   * admin_operation_logs findFirstOrThrow
   */
  export type admin_operation_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter, which admin_operation_logs to fetch.
     */
    where?: admin_operation_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_operation_logs to fetch.
     */
    orderBy?: admin_operation_logsOrderByWithRelationInput | admin_operation_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admin_operation_logs.
     */
    cursor?: admin_operation_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_operation_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_operation_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admin_operation_logs.
     */
    distinct?: Admin_operation_logsScalarFieldEnum | Admin_operation_logsScalarFieldEnum[]
  }

  /**
   * admin_operation_logs findMany
   */
  export type admin_operation_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter, which admin_operation_logs to fetch.
     */
    where?: admin_operation_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_operation_logs to fetch.
     */
    orderBy?: admin_operation_logsOrderByWithRelationInput | admin_operation_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing admin_operation_logs.
     */
    cursor?: admin_operation_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_operation_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_operation_logs.
     */
    skip?: number
    distinct?: Admin_operation_logsScalarFieldEnum | Admin_operation_logsScalarFieldEnum[]
  }

  /**
   * admin_operation_logs create
   */
  export type admin_operation_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a admin_operation_logs.
     */
    data: XOR<admin_operation_logsCreateInput, admin_operation_logsUncheckedCreateInput>
  }

  /**
   * admin_operation_logs createMany
   */
  export type admin_operation_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many admin_operation_logs.
     */
    data: admin_operation_logsCreateManyInput | admin_operation_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * admin_operation_logs createManyAndReturn
   */
  export type admin_operation_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * The data used to create many admin_operation_logs.
     */
    data: admin_operation_logsCreateManyInput | admin_operation_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * admin_operation_logs update
   */
  export type admin_operation_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a admin_operation_logs.
     */
    data: XOR<admin_operation_logsUpdateInput, admin_operation_logsUncheckedUpdateInput>
    /**
     * Choose, which admin_operation_logs to update.
     */
    where: admin_operation_logsWhereUniqueInput
  }

  /**
   * admin_operation_logs updateMany
   */
  export type admin_operation_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update admin_operation_logs.
     */
    data: XOR<admin_operation_logsUpdateManyMutationInput, admin_operation_logsUncheckedUpdateManyInput>
    /**
     * Filter which admin_operation_logs to update
     */
    where?: admin_operation_logsWhereInput
    /**
     * Limit how many admin_operation_logs to update.
     */
    limit?: number
  }

  /**
   * admin_operation_logs updateManyAndReturn
   */
  export type admin_operation_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * The data used to update admin_operation_logs.
     */
    data: XOR<admin_operation_logsUpdateManyMutationInput, admin_operation_logsUncheckedUpdateManyInput>
    /**
     * Filter which admin_operation_logs to update
     */
    where?: admin_operation_logsWhereInput
    /**
     * Limit how many admin_operation_logs to update.
     */
    limit?: number
  }

  /**
   * admin_operation_logs upsert
   */
  export type admin_operation_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the admin_operation_logs to update in case it exists.
     */
    where: admin_operation_logsWhereUniqueInput
    /**
     * In case the admin_operation_logs found by the `where` argument doesn't exist, create a new admin_operation_logs with this data.
     */
    create: XOR<admin_operation_logsCreateInput, admin_operation_logsUncheckedCreateInput>
    /**
     * In case the admin_operation_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<admin_operation_logsUpdateInput, admin_operation_logsUncheckedUpdateInput>
  }

  /**
   * admin_operation_logs delete
   */
  export type admin_operation_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
    /**
     * Filter which admin_operation_logs to delete.
     */
    where: admin_operation_logsWhereUniqueInput
  }

  /**
   * admin_operation_logs deleteMany
   */
  export type admin_operation_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admin_operation_logs to delete
     */
    where?: admin_operation_logsWhereInput
    /**
     * Limit how many admin_operation_logs to delete.
     */
    limit?: number
  }

  /**
   * admin_operation_logs without action
   */
  export type admin_operation_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_operation_logs
     */
    select?: admin_operation_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_operation_logs
     */
    omit?: admin_operation_logsOmit<ExtArgs> | null
  }


  /**
   * Model audit_logs
   */

  export type AggregateAudit_logs = {
    _count: Audit_logsCountAggregateOutputType | null
    _avg: Audit_logsAvgAggregateOutputType | null
    _sum: Audit_logsSumAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  export type Audit_logsAvgAggregateOutputType = {
    status: number | null
  }

  export type Audit_logsSumAggregateOutputType = {
    status: number | null
  }

  export type Audit_logsMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    user_phone: string | null
    user_ip: string | null
    scene: string | null
    tone: string | null
    input_prompt: string | null
    output_content: string | null
    model_name: string | null
    audit_token: string | null
    status: number | null
    is_sensitive: boolean | null
    external_audit_id: string | null
    created_time: Date | null
  }

  export type Audit_logsMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    user_phone: string | null
    user_ip: string | null
    scene: string | null
    tone: string | null
    input_prompt: string | null
    output_content: string | null
    model_name: string | null
    audit_token: string | null
    status: number | null
    is_sensitive: boolean | null
    external_audit_id: string | null
    created_time: Date | null
  }

  export type Audit_logsCountAggregateOutputType = {
    id: number
    user_id: number
    user_phone: number
    user_ip: number
    scene: number
    tone: number
    input_prompt: number
    output_content: number
    model_name: number
    audit_token: number
    status: number
    is_sensitive: number
    external_audit_id: number
    created_time: number
    _all: number
  }


  export type Audit_logsAvgAggregateInputType = {
    status?: true
  }

  export type Audit_logsSumAggregateInputType = {
    status?: true
  }

  export type Audit_logsMinAggregateInputType = {
    id?: true
    user_id?: true
    user_phone?: true
    user_ip?: true
    scene?: true
    tone?: true
    input_prompt?: true
    output_content?: true
    model_name?: true
    audit_token?: true
    status?: true
    is_sensitive?: true
    external_audit_id?: true
    created_time?: true
  }

  export type Audit_logsMaxAggregateInputType = {
    id?: true
    user_id?: true
    user_phone?: true
    user_ip?: true
    scene?: true
    tone?: true
    input_prompt?: true
    output_content?: true
    model_name?: true
    audit_token?: true
    status?: true
    is_sensitive?: true
    external_audit_id?: true
    created_time?: true
  }

  export type Audit_logsCountAggregateInputType = {
    id?: true
    user_id?: true
    user_phone?: true
    user_ip?: true
    scene?: true
    tone?: true
    input_prompt?: true
    output_content?: true
    model_name?: true
    audit_token?: true
    status?: true
    is_sensitive?: true
    external_audit_id?: true
    created_time?: true
    _all?: true
  }

  export type Audit_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to aggregate.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned audit_logs
    **/
    _count?: true | Audit_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Audit_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Audit_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Audit_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Audit_logsMaxAggregateInputType
  }

  export type GetAudit_logsAggregateType<T extends Audit_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateAudit_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudit_logs[P]>
      : GetScalarType<T[P], AggregateAudit_logs[P]>
  }




  export type audit_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: audit_logsWhereInput
    orderBy?: audit_logsOrderByWithAggregationInput | audit_logsOrderByWithAggregationInput[]
    by: Audit_logsScalarFieldEnum[] | Audit_logsScalarFieldEnum
    having?: audit_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Audit_logsCountAggregateInputType | true
    _avg?: Audit_logsAvgAggregateInputType
    _sum?: Audit_logsSumAggregateInputType
    _min?: Audit_logsMinAggregateInputType
    _max?: Audit_logsMaxAggregateInputType
  }

  export type Audit_logsGroupByOutputType = {
    id: string
    user_id: string
    user_phone: string | null
    user_ip: string
    scene: string | null
    tone: string | null
    input_prompt: string
    output_content: string
    model_name: string | null
    audit_token: string | null
    status: number | null
    is_sensitive: boolean | null
    external_audit_id: string | null
    created_time: Date | null
    _count: Audit_logsCountAggregateOutputType | null
    _avg: Audit_logsAvgAggregateOutputType | null
    _sum: Audit_logsSumAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  type GetAudit_logsGroupByPayload<T extends audit_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Audit_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Audit_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
        }
      >
    >


  export type audit_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_phone?: boolean
    user_ip?: boolean
    scene?: boolean
    tone?: boolean
    input_prompt?: boolean
    output_content?: boolean
    model_name?: boolean
    audit_token?: boolean
    status?: boolean
    is_sensitive?: boolean
    external_audit_id?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_phone?: boolean
    user_ip?: boolean
    scene?: boolean
    tone?: boolean
    input_prompt?: boolean
    output_content?: boolean
    model_name?: boolean
    audit_token?: boolean
    status?: boolean
    is_sensitive?: boolean
    external_audit_id?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_phone?: boolean
    user_ip?: boolean
    scene?: boolean
    tone?: boolean
    input_prompt?: boolean
    output_content?: boolean
    model_name?: boolean
    audit_token?: boolean
    status?: boolean
    is_sensitive?: boolean
    external_audit_id?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectScalar = {
    id?: boolean
    user_id?: boolean
    user_phone?: boolean
    user_ip?: boolean
    scene?: boolean
    tone?: boolean
    input_prompt?: boolean
    output_content?: boolean
    model_name?: boolean
    audit_token?: boolean
    status?: boolean
    is_sensitive?: boolean
    external_audit_id?: boolean
    created_time?: boolean
  }

  export type audit_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "user_phone" | "user_ip" | "scene" | "tone" | "input_prompt" | "output_content" | "model_name" | "audit_token" | "status" | "is_sensitive" | "external_audit_id" | "created_time", ExtArgs["result"]["audit_logs"]>

  export type $audit_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "audit_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      user_phone: string | null
      user_ip: string
      scene: string | null
      tone: string | null
      input_prompt: string
      output_content: string
      model_name: string | null
      audit_token: string | null
      status: number | null
      is_sensitive: boolean | null
      external_audit_id: string | null
      created_time: Date | null
    }, ExtArgs["result"]["audit_logs"]>
    composites: {}
  }

  type audit_logsGetPayload<S extends boolean | null | undefined | audit_logsDefaultArgs> = $Result.GetResult<Prisma.$audit_logsPayload, S>

  type audit_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<audit_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Audit_logsCountAggregateInputType | true
    }

  export interface audit_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['audit_logs'], meta: { name: 'audit_logs' } }
    /**
     * Find zero or one Audit_logs that matches the filter.
     * @param {audit_logsFindUniqueArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends audit_logsFindUniqueArgs>(args: SelectSubset<T, audit_logsFindUniqueArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Audit_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {audit_logsFindUniqueOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends audit_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, audit_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends audit_logsFindFirstArgs>(args?: SelectSubset<T, audit_logsFindFirstArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audit_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends audit_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, audit_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany()
     * 
     * // Get first 10 Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends audit_logsFindManyArgs>(args?: SelectSubset<T, audit_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Audit_logs.
     * @param {audit_logsCreateArgs} args - Arguments to create a Audit_logs.
     * @example
     * // Create one Audit_logs
     * const Audit_logs = await prisma.audit_logs.create({
     *   data: {
     *     // ... data to create a Audit_logs
     *   }
     * })
     * 
     */
    create<T extends audit_logsCreateArgs>(args: SelectSubset<T, audit_logsCreateArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Audit_logs.
     * @param {audit_logsCreateManyArgs} args - Arguments to create many Audit_logs.
     * @example
     * // Create many Audit_logs
     * const audit_logs = await prisma.audit_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends audit_logsCreateManyArgs>(args?: SelectSubset<T, audit_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Audit_logs and returns the data saved in the database.
     * @param {audit_logsCreateManyAndReturnArgs} args - Arguments to create many Audit_logs.
     * @example
     * // Create many Audit_logs
     * const audit_logs = await prisma.audit_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Audit_logs and only return the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends audit_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, audit_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Audit_logs.
     * @param {audit_logsDeleteArgs} args - Arguments to delete one Audit_logs.
     * @example
     * // Delete one Audit_logs
     * const Audit_logs = await prisma.audit_logs.delete({
     *   where: {
     *     // ... filter to delete one Audit_logs
     *   }
     * })
     * 
     */
    delete<T extends audit_logsDeleteArgs>(args: SelectSubset<T, audit_logsDeleteArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Audit_logs.
     * @param {audit_logsUpdateArgs} args - Arguments to update one Audit_logs.
     * @example
     * // Update one Audit_logs
     * const audit_logs = await prisma.audit_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends audit_logsUpdateArgs>(args: SelectSubset<T, audit_logsUpdateArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Audit_logs.
     * @param {audit_logsDeleteManyArgs} args - Arguments to filter Audit_logs to delete.
     * @example
     * // Delete a few Audit_logs
     * const { count } = await prisma.audit_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends audit_logsDeleteManyArgs>(args?: SelectSubset<T, audit_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Audit_logs
     * const audit_logs = await prisma.audit_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends audit_logsUpdateManyArgs>(args: SelectSubset<T, audit_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audit_logs and returns the data updated in the database.
     * @param {audit_logsUpdateManyAndReturnArgs} args - Arguments to update many Audit_logs.
     * @example
     * // Update many Audit_logs
     * const audit_logs = await prisma.audit_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Audit_logs and only return the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends audit_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, audit_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Audit_logs.
     * @param {audit_logsUpsertArgs} args - Arguments to update or create a Audit_logs.
     * @example
     * // Update or create a Audit_logs
     * const audit_logs = await prisma.audit_logs.upsert({
     *   create: {
     *     // ... data to create a Audit_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Audit_logs we want to update
     *   }
     * })
     */
    upsert<T extends audit_logsUpsertArgs>(args: SelectSubset<T, audit_logsUpsertArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsCountArgs} args - Arguments to filter Audit_logs to count.
     * @example
     * // Count the number of Audit_logs
     * const count = await prisma.audit_logs.count({
     *   where: {
     *     // ... the filter for the Audit_logs we want to count
     *   }
     * })
    **/
    count<T extends audit_logsCountArgs>(
      args?: Subset<T, audit_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Audit_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Audit_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Audit_logsAggregateArgs>(args: Subset<T, Audit_logsAggregateArgs>): Prisma.PrismaPromise<GetAudit_logsAggregateType<T>>

    /**
     * Group by Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends audit_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: audit_logsGroupByArgs['orderBy'] }
        : { orderBy?: audit_logsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, audit_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudit_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the audit_logs model
   */
  readonly fields: audit_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for audit_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__audit_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the audit_logs model
   */
  interface audit_logsFieldRefs {
    readonly id: FieldRef<"audit_logs", 'String'>
    readonly user_id: FieldRef<"audit_logs", 'String'>
    readonly user_phone: FieldRef<"audit_logs", 'String'>
    readonly user_ip: FieldRef<"audit_logs", 'String'>
    readonly scene: FieldRef<"audit_logs", 'String'>
    readonly tone: FieldRef<"audit_logs", 'String'>
    readonly input_prompt: FieldRef<"audit_logs", 'String'>
    readonly output_content: FieldRef<"audit_logs", 'String'>
    readonly model_name: FieldRef<"audit_logs", 'String'>
    readonly audit_token: FieldRef<"audit_logs", 'String'>
    readonly status: FieldRef<"audit_logs", 'Int'>
    readonly is_sensitive: FieldRef<"audit_logs", 'Boolean'>
    readonly external_audit_id: FieldRef<"audit_logs", 'String'>
    readonly created_time: FieldRef<"audit_logs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * audit_logs findUnique
   */
  export type audit_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs findUniqueOrThrow
   */
  export type audit_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs findFirst
   */
  export type audit_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs findFirstOrThrow
   */
  export type audit_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs findMany
   */
  export type audit_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs create
   */
  export type audit_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a audit_logs.
     */
    data: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
  }

  /**
   * audit_logs createMany
   */
  export type audit_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many audit_logs.
     */
    data: audit_logsCreateManyInput | audit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * audit_logs createManyAndReturn
   */
  export type audit_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data used to create many audit_logs.
     */
    data: audit_logsCreateManyInput | audit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * audit_logs update
   */
  export type audit_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a audit_logs.
     */
    data: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
    /**
     * Choose, which audit_logs to update.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs updateMany
   */
  export type audit_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update audit_logs.
     */
    data: XOR<audit_logsUpdateManyMutationInput, audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which audit_logs to update
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to update.
     */
    limit?: number
  }

  /**
   * audit_logs updateManyAndReturn
   */
  export type audit_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data used to update audit_logs.
     */
    data: XOR<audit_logsUpdateManyMutationInput, audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which audit_logs to update
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to update.
     */
    limit?: number
  }

  /**
   * audit_logs upsert
   */
  export type audit_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the audit_logs to update in case it exists.
     */
    where: audit_logsWhereUniqueInput
    /**
     * In case the audit_logs found by the `where` argument doesn't exist, create a new audit_logs with this data.
     */
    create: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
    /**
     * In case the audit_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
  }

  /**
   * audit_logs delete
   */
  export type audit_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter which audit_logs to delete.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs deleteMany
   */
  export type audit_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to delete
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to delete.
     */
    limit?: number
  }

  /**
   * audit_logs without action
   */
  export type audit_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
  }


  /**
   * Model feedbacks
   */

  export type AggregateFeedbacks = {
    _count: FeedbacksCountAggregateOutputType | null
    _avg: FeedbacksAvgAggregateOutputType | null
    _sum: FeedbacksSumAggregateOutputType | null
    _min: FeedbacksMinAggregateOutputType | null
    _max: FeedbacksMaxAggregateOutputType | null
  }

  export type FeedbacksAvgAggregateOutputType = {
    status: number | null
  }

  export type FeedbacksSumAggregateOutputType = {
    status: number | null
  }

  export type FeedbacksMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    log_id: string | null
    type: string | null
    content: string | null
    status: number | null
    admin_note: string | null
    processed_time: Date | null
    created_time: Date | null
  }

  export type FeedbacksMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    log_id: string | null
    type: string | null
    content: string | null
    status: number | null
    admin_note: string | null
    processed_time: Date | null
    created_time: Date | null
  }

  export type FeedbacksCountAggregateOutputType = {
    id: number
    user_id: number
    log_id: number
    type: number
    content: number
    status: number
    admin_note: number
    processed_time: number
    created_time: number
    _all: number
  }


  export type FeedbacksAvgAggregateInputType = {
    status?: true
  }

  export type FeedbacksSumAggregateInputType = {
    status?: true
  }

  export type FeedbacksMinAggregateInputType = {
    id?: true
    user_id?: true
    log_id?: true
    type?: true
    content?: true
    status?: true
    admin_note?: true
    processed_time?: true
    created_time?: true
  }

  export type FeedbacksMaxAggregateInputType = {
    id?: true
    user_id?: true
    log_id?: true
    type?: true
    content?: true
    status?: true
    admin_note?: true
    processed_time?: true
    created_time?: true
  }

  export type FeedbacksCountAggregateInputType = {
    id?: true
    user_id?: true
    log_id?: true
    type?: true
    content?: true
    status?: true
    admin_note?: true
    processed_time?: true
    created_time?: true
    _all?: true
  }

  export type FeedbacksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedbacks to aggregate.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned feedbacks
    **/
    _count?: true | FeedbacksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbacksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbacksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbacksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbacksMaxAggregateInputType
  }

  export type GetFeedbacksAggregateType<T extends FeedbacksAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedbacks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedbacks[P]>
      : GetScalarType<T[P], AggregateFeedbacks[P]>
  }




  export type feedbacksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: feedbacksWhereInput
    orderBy?: feedbacksOrderByWithAggregationInput | feedbacksOrderByWithAggregationInput[]
    by: FeedbacksScalarFieldEnum[] | FeedbacksScalarFieldEnum
    having?: feedbacksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbacksCountAggregateInputType | true
    _avg?: FeedbacksAvgAggregateInputType
    _sum?: FeedbacksSumAggregateInputType
    _min?: FeedbacksMinAggregateInputType
    _max?: FeedbacksMaxAggregateInputType
  }

  export type FeedbacksGroupByOutputType = {
    id: string
    user_id: string
    log_id: string | null
    type: string
    content: string
    status: number | null
    admin_note: string | null
    processed_time: Date | null
    created_time: Date | null
    _count: FeedbacksCountAggregateOutputType | null
    _avg: FeedbacksAvgAggregateOutputType | null
    _sum: FeedbacksSumAggregateOutputType | null
    _min: FeedbacksMinAggregateOutputType | null
    _max: FeedbacksMaxAggregateOutputType | null
  }

  type GetFeedbacksGroupByPayload<T extends feedbacksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbacksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbacksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbacksGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbacksGroupByOutputType[P]>
        }
      >
    >


  export type feedbacksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    log_id?: boolean
    type?: boolean
    content?: boolean
    status?: boolean
    admin_note?: boolean
    processed_time?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    log_id?: boolean
    type?: boolean
    content?: boolean
    status?: boolean
    admin_note?: boolean
    processed_time?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    log_id?: boolean
    type?: boolean
    content?: boolean
    status?: boolean
    admin_note?: boolean
    processed_time?: boolean
    created_time?: boolean
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectScalar = {
    id?: boolean
    user_id?: boolean
    log_id?: boolean
    type?: boolean
    content?: boolean
    status?: boolean
    admin_note?: boolean
    processed_time?: boolean
    created_time?: boolean
  }

  export type feedbacksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "log_id" | "type" | "content" | "status" | "admin_note" | "processed_time" | "created_time", ExtArgs["result"]["feedbacks"]>

  export type $feedbacksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "feedbacks"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      log_id: string | null
      type: string
      content: string
      status: number | null
      admin_note: string | null
      processed_time: Date | null
      created_time: Date | null
    }, ExtArgs["result"]["feedbacks"]>
    composites: {}
  }

  type feedbacksGetPayload<S extends boolean | null | undefined | feedbacksDefaultArgs> = $Result.GetResult<Prisma.$feedbacksPayload, S>

  type feedbacksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<feedbacksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbacksCountAggregateInputType | true
    }

  export interface feedbacksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['feedbacks'], meta: { name: 'feedbacks' } }
    /**
     * Find zero or one Feedbacks that matches the filter.
     * @param {feedbacksFindUniqueArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends feedbacksFindUniqueArgs>(args: SelectSubset<T, feedbacksFindUniqueArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedbacks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {feedbacksFindUniqueOrThrowArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends feedbacksFindUniqueOrThrowArgs>(args: SelectSubset<T, feedbacksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindFirstArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends feedbacksFindFirstArgs>(args?: SelectSubset<T, feedbacksFindFirstArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedbacks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindFirstOrThrowArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends feedbacksFindFirstOrThrowArgs>(args?: SelectSubset<T, feedbacksFindFirstOrThrowArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedbacks.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedbacks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends feedbacksFindManyArgs>(args?: SelectSubset<T, feedbacksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedbacks.
     * @param {feedbacksCreateArgs} args - Arguments to create a Feedbacks.
     * @example
     * // Create one Feedbacks
     * const Feedbacks = await prisma.feedbacks.create({
     *   data: {
     *     // ... data to create a Feedbacks
     *   }
     * })
     * 
     */
    create<T extends feedbacksCreateArgs>(args: SelectSubset<T, feedbacksCreateArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {feedbacksCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedbacks = await prisma.feedbacks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends feedbacksCreateManyArgs>(args?: SelectSubset<T, feedbacksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {feedbacksCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedbacks = await prisma.feedbacks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends feedbacksCreateManyAndReturnArgs>(args?: SelectSubset<T, feedbacksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedbacks.
     * @param {feedbacksDeleteArgs} args - Arguments to delete one Feedbacks.
     * @example
     * // Delete one Feedbacks
     * const Feedbacks = await prisma.feedbacks.delete({
     *   where: {
     *     // ... filter to delete one Feedbacks
     *   }
     * })
     * 
     */
    delete<T extends feedbacksDeleteArgs>(args: SelectSubset<T, feedbacksDeleteArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedbacks.
     * @param {feedbacksUpdateArgs} args - Arguments to update one Feedbacks.
     * @example
     * // Update one Feedbacks
     * const feedbacks = await prisma.feedbacks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends feedbacksUpdateArgs>(args: SelectSubset<T, feedbacksUpdateArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {feedbacksDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedbacks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends feedbacksDeleteManyArgs>(args?: SelectSubset<T, feedbacksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedbacks = await prisma.feedbacks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends feedbacksUpdateManyArgs>(args: SelectSubset<T, feedbacksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {feedbacksUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedbacks = await prisma.feedbacks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends feedbacksUpdateManyAndReturnArgs>(args: SelectSubset<T, feedbacksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedbacks.
     * @param {feedbacksUpsertArgs} args - Arguments to update or create a Feedbacks.
     * @example
     * // Update or create a Feedbacks
     * const feedbacks = await prisma.feedbacks.upsert({
     *   create: {
     *     // ... data to create a Feedbacks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedbacks we want to update
     *   }
     * })
     */
    upsert<T extends feedbacksUpsertArgs>(args: SelectSubset<T, feedbacksUpsertArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedbacks.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends feedbacksCountArgs>(
      args?: Subset<T, feedbacksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbacksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbacksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbacksAggregateArgs>(args: Subset<T, FeedbacksAggregateArgs>): Prisma.PrismaPromise<GetFeedbacksAggregateType<T>>

    /**
     * Group by Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends feedbacksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: feedbacksGroupByArgs['orderBy'] }
        : { orderBy?: feedbacksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, feedbacksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbacksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the feedbacks model
   */
  readonly fields: feedbacksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for feedbacks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__feedbacksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the feedbacks model
   */
  interface feedbacksFieldRefs {
    readonly id: FieldRef<"feedbacks", 'String'>
    readonly user_id: FieldRef<"feedbacks", 'String'>
    readonly log_id: FieldRef<"feedbacks", 'String'>
    readonly type: FieldRef<"feedbacks", 'String'>
    readonly content: FieldRef<"feedbacks", 'String'>
    readonly status: FieldRef<"feedbacks", 'Int'>
    readonly admin_note: FieldRef<"feedbacks", 'String'>
    readonly processed_time: FieldRef<"feedbacks", 'DateTime'>
    readonly created_time: FieldRef<"feedbacks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * feedbacks findUnique
   */
  export type feedbacksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks findUniqueOrThrow
   */
  export type feedbacksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks findFirst
   */
  export type feedbacksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks findFirstOrThrow
   */
  export type feedbacksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks findMany
   */
  export type feedbacksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks create
   */
  export type feedbacksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data needed to create a feedbacks.
     */
    data: XOR<feedbacksCreateInput, feedbacksUncheckedCreateInput>
  }

  /**
   * feedbacks createMany
   */
  export type feedbacksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many feedbacks.
     */
    data: feedbacksCreateManyInput | feedbacksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * feedbacks createManyAndReturn
   */
  export type feedbacksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data used to create many feedbacks.
     */
    data: feedbacksCreateManyInput | feedbacksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * feedbacks update
   */
  export type feedbacksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data needed to update a feedbacks.
     */
    data: XOR<feedbacksUpdateInput, feedbacksUncheckedUpdateInput>
    /**
     * Choose, which feedbacks to update.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks updateMany
   */
  export type feedbacksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update feedbacks.
     */
    data: XOR<feedbacksUpdateManyMutationInput, feedbacksUncheckedUpdateManyInput>
    /**
     * Filter which feedbacks to update
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to update.
     */
    limit?: number
  }

  /**
   * feedbacks updateManyAndReturn
   */
  export type feedbacksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data used to update feedbacks.
     */
    data: XOR<feedbacksUpdateManyMutationInput, feedbacksUncheckedUpdateManyInput>
    /**
     * Filter which feedbacks to update
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to update.
     */
    limit?: number
  }

  /**
   * feedbacks upsert
   */
  export type feedbacksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The filter to search for the feedbacks to update in case it exists.
     */
    where: feedbacksWhereUniqueInput
    /**
     * In case the feedbacks found by the `where` argument doesn't exist, create a new feedbacks with this data.
     */
    create: XOR<feedbacksCreateInput, feedbacksUncheckedCreateInput>
    /**
     * In case the feedbacks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<feedbacksUpdateInput, feedbacksUncheckedUpdateInput>
  }

  /**
   * feedbacks delete
   */
  export type feedbacksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Filter which feedbacks to delete.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks deleteMany
   */
  export type feedbacksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedbacks to delete
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to delete.
     */
    limit?: number
  }

  /**
   * feedbacks without action
   */
  export type feedbacksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
  }


  /**
   * Model mail_histories
   */

  export type AggregateMail_histories = {
    _count: Mail_historiesCountAggregateOutputType | null
    _min: Mail_historiesMinAggregateOutputType | null
    _max: Mail_historiesMaxAggregateOutputType | null
  }

  export type Mail_historiesMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    audit_log_id: string | null
    scene: string | null
    tone: string | null
    recipient_name: string | null
    recipient_role: string | null
    sender_name: string | null
    core_points: string | null
    mail_content: string | null
    is_favorite: boolean | null
    is_deleted: boolean | null
    created_time: Date | null
    updated_time: Date | null
  }

  export type Mail_historiesMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    audit_log_id: string | null
    scene: string | null
    tone: string | null
    recipient_name: string | null
    recipient_role: string | null
    sender_name: string | null
    core_points: string | null
    mail_content: string | null
    is_favorite: boolean | null
    is_deleted: boolean | null
    created_time: Date | null
    updated_time: Date | null
  }

  export type Mail_historiesCountAggregateOutputType = {
    id: number
    user_id: number
    audit_log_id: number
    scene: number
    tone: number
    recipient_name: number
    recipient_role: number
    sender_name: number
    core_points: number
    mail_content: number
    is_favorite: number
    is_deleted: number
    created_time: number
    updated_time: number
    _all: number
  }


  export type Mail_historiesMinAggregateInputType = {
    id?: true
    user_id?: true
    audit_log_id?: true
    scene?: true
    tone?: true
    recipient_name?: true
    recipient_role?: true
    sender_name?: true
    core_points?: true
    mail_content?: true
    is_favorite?: true
    is_deleted?: true
    created_time?: true
    updated_time?: true
  }

  export type Mail_historiesMaxAggregateInputType = {
    id?: true
    user_id?: true
    audit_log_id?: true
    scene?: true
    tone?: true
    recipient_name?: true
    recipient_role?: true
    sender_name?: true
    core_points?: true
    mail_content?: true
    is_favorite?: true
    is_deleted?: true
    created_time?: true
    updated_time?: true
  }

  export type Mail_historiesCountAggregateInputType = {
    id?: true
    user_id?: true
    audit_log_id?: true
    scene?: true
    tone?: true
    recipient_name?: true
    recipient_role?: true
    sender_name?: true
    core_points?: true
    mail_content?: true
    is_favorite?: true
    is_deleted?: true
    created_time?: true
    updated_time?: true
    _all?: true
  }

  export type Mail_historiesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mail_histories to aggregate.
     */
    where?: mail_historiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mail_histories to fetch.
     */
    orderBy?: mail_historiesOrderByWithRelationInput | mail_historiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: mail_historiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mail_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mail_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned mail_histories
    **/
    _count?: true | Mail_historiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Mail_historiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Mail_historiesMaxAggregateInputType
  }

  export type GetMail_historiesAggregateType<T extends Mail_historiesAggregateArgs> = {
        [P in keyof T & keyof AggregateMail_histories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMail_histories[P]>
      : GetScalarType<T[P], AggregateMail_histories[P]>
  }




  export type mail_historiesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: mail_historiesWhereInput
    orderBy?: mail_historiesOrderByWithAggregationInput | mail_historiesOrderByWithAggregationInput[]
    by: Mail_historiesScalarFieldEnum[] | Mail_historiesScalarFieldEnum
    having?: mail_historiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Mail_historiesCountAggregateInputType | true
    _min?: Mail_historiesMinAggregateInputType
    _max?: Mail_historiesMaxAggregateInputType
  }

  export type Mail_historiesGroupByOutputType = {
    id: string
    user_id: string
    audit_log_id: string | null
    scene: string | null
    tone: string | null
    recipient_name: string | null
    recipient_role: string | null
    sender_name: string | null
    core_points: string | null
    mail_content: string
    is_favorite: boolean | null
    is_deleted: boolean | null
    created_time: Date | null
    updated_time: Date | null
    _count: Mail_historiesCountAggregateOutputType | null
    _min: Mail_historiesMinAggregateOutputType | null
    _max: Mail_historiesMaxAggregateOutputType | null
  }

  type GetMail_historiesGroupByPayload<T extends mail_historiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Mail_historiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Mail_historiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Mail_historiesGroupByOutputType[P]>
            : GetScalarType<T[P], Mail_historiesGroupByOutputType[P]>
        }
      >
    >


  export type mail_historiesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    audit_log_id?: boolean
    scene?: boolean
    tone?: boolean
    recipient_name?: boolean
    recipient_role?: boolean
    sender_name?: boolean
    core_points?: boolean
    mail_content?: boolean
    is_favorite?: boolean
    is_deleted?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["mail_histories"]>

  export type mail_historiesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    audit_log_id?: boolean
    scene?: boolean
    tone?: boolean
    recipient_name?: boolean
    recipient_role?: boolean
    sender_name?: boolean
    core_points?: boolean
    mail_content?: boolean
    is_favorite?: boolean
    is_deleted?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["mail_histories"]>

  export type mail_historiesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    audit_log_id?: boolean
    scene?: boolean
    tone?: boolean
    recipient_name?: boolean
    recipient_role?: boolean
    sender_name?: boolean
    core_points?: boolean
    mail_content?: boolean
    is_favorite?: boolean
    is_deleted?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["mail_histories"]>

  export type mail_historiesSelectScalar = {
    id?: boolean
    user_id?: boolean
    audit_log_id?: boolean
    scene?: boolean
    tone?: boolean
    recipient_name?: boolean
    recipient_role?: boolean
    sender_name?: boolean
    core_points?: boolean
    mail_content?: boolean
    is_favorite?: boolean
    is_deleted?: boolean
    created_time?: boolean
    updated_time?: boolean
  }

  export type mail_historiesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "audit_log_id" | "scene" | "tone" | "recipient_name" | "recipient_role" | "sender_name" | "core_points" | "mail_content" | "is_favorite" | "is_deleted" | "created_time" | "updated_time", ExtArgs["result"]["mail_histories"]>

  export type $mail_historiesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "mail_histories"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      audit_log_id: string | null
      scene: string | null
      tone: string | null
      recipient_name: string | null
      recipient_role: string | null
      sender_name: string | null
      core_points: string | null
      mail_content: string
      is_favorite: boolean | null
      is_deleted: boolean | null
      created_time: Date | null
      updated_time: Date | null
    }, ExtArgs["result"]["mail_histories"]>
    composites: {}
  }

  type mail_historiesGetPayload<S extends boolean | null | undefined | mail_historiesDefaultArgs> = $Result.GetResult<Prisma.$mail_historiesPayload, S>

  type mail_historiesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<mail_historiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Mail_historiesCountAggregateInputType | true
    }

  export interface mail_historiesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['mail_histories'], meta: { name: 'mail_histories' } }
    /**
     * Find zero or one Mail_histories that matches the filter.
     * @param {mail_historiesFindUniqueArgs} args - Arguments to find a Mail_histories
     * @example
     * // Get one Mail_histories
     * const mail_histories = await prisma.mail_histories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends mail_historiesFindUniqueArgs>(args: SelectSubset<T, mail_historiesFindUniqueArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mail_histories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {mail_historiesFindUniqueOrThrowArgs} args - Arguments to find a Mail_histories
     * @example
     * // Get one Mail_histories
     * const mail_histories = await prisma.mail_histories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends mail_historiesFindUniqueOrThrowArgs>(args: SelectSubset<T, mail_historiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mail_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesFindFirstArgs} args - Arguments to find a Mail_histories
     * @example
     * // Get one Mail_histories
     * const mail_histories = await prisma.mail_histories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends mail_historiesFindFirstArgs>(args?: SelectSubset<T, mail_historiesFindFirstArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mail_histories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesFindFirstOrThrowArgs} args - Arguments to find a Mail_histories
     * @example
     * // Get one Mail_histories
     * const mail_histories = await prisma.mail_histories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends mail_historiesFindFirstOrThrowArgs>(args?: SelectSubset<T, mail_historiesFindFirstOrThrowArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mail_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mail_histories
     * const mail_histories = await prisma.mail_histories.findMany()
     * 
     * // Get first 10 Mail_histories
     * const mail_histories = await prisma.mail_histories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mail_historiesWithIdOnly = await prisma.mail_histories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends mail_historiesFindManyArgs>(args?: SelectSubset<T, mail_historiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mail_histories.
     * @param {mail_historiesCreateArgs} args - Arguments to create a Mail_histories.
     * @example
     * // Create one Mail_histories
     * const Mail_histories = await prisma.mail_histories.create({
     *   data: {
     *     // ... data to create a Mail_histories
     *   }
     * })
     * 
     */
    create<T extends mail_historiesCreateArgs>(args: SelectSubset<T, mail_historiesCreateArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mail_histories.
     * @param {mail_historiesCreateManyArgs} args - Arguments to create many Mail_histories.
     * @example
     * // Create many Mail_histories
     * const mail_histories = await prisma.mail_histories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends mail_historiesCreateManyArgs>(args?: SelectSubset<T, mail_historiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Mail_histories and returns the data saved in the database.
     * @param {mail_historiesCreateManyAndReturnArgs} args - Arguments to create many Mail_histories.
     * @example
     * // Create many Mail_histories
     * const mail_histories = await prisma.mail_histories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Mail_histories and only return the `id`
     * const mail_historiesWithIdOnly = await prisma.mail_histories.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends mail_historiesCreateManyAndReturnArgs>(args?: SelectSubset<T, mail_historiesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mail_histories.
     * @param {mail_historiesDeleteArgs} args - Arguments to delete one Mail_histories.
     * @example
     * // Delete one Mail_histories
     * const Mail_histories = await prisma.mail_histories.delete({
     *   where: {
     *     // ... filter to delete one Mail_histories
     *   }
     * })
     * 
     */
    delete<T extends mail_historiesDeleteArgs>(args: SelectSubset<T, mail_historiesDeleteArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mail_histories.
     * @param {mail_historiesUpdateArgs} args - Arguments to update one Mail_histories.
     * @example
     * // Update one Mail_histories
     * const mail_histories = await prisma.mail_histories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends mail_historiesUpdateArgs>(args: SelectSubset<T, mail_historiesUpdateArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mail_histories.
     * @param {mail_historiesDeleteManyArgs} args - Arguments to filter Mail_histories to delete.
     * @example
     * // Delete a few Mail_histories
     * const { count } = await prisma.mail_histories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends mail_historiesDeleteManyArgs>(args?: SelectSubset<T, mail_historiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mail_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mail_histories
     * const mail_histories = await prisma.mail_histories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends mail_historiesUpdateManyArgs>(args: SelectSubset<T, mail_historiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mail_histories and returns the data updated in the database.
     * @param {mail_historiesUpdateManyAndReturnArgs} args - Arguments to update many Mail_histories.
     * @example
     * // Update many Mail_histories
     * const mail_histories = await prisma.mail_histories.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Mail_histories and only return the `id`
     * const mail_historiesWithIdOnly = await prisma.mail_histories.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends mail_historiesUpdateManyAndReturnArgs>(args: SelectSubset<T, mail_historiesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mail_histories.
     * @param {mail_historiesUpsertArgs} args - Arguments to update or create a Mail_histories.
     * @example
     * // Update or create a Mail_histories
     * const mail_histories = await prisma.mail_histories.upsert({
     *   create: {
     *     // ... data to create a Mail_histories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mail_histories we want to update
     *   }
     * })
     */
    upsert<T extends mail_historiesUpsertArgs>(args: SelectSubset<T, mail_historiesUpsertArgs<ExtArgs>>): Prisma__mail_historiesClient<$Result.GetResult<Prisma.$mail_historiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mail_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesCountArgs} args - Arguments to filter Mail_histories to count.
     * @example
     * // Count the number of Mail_histories
     * const count = await prisma.mail_histories.count({
     *   where: {
     *     // ... the filter for the Mail_histories we want to count
     *   }
     * })
    **/
    count<T extends mail_historiesCountArgs>(
      args?: Subset<T, mail_historiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Mail_historiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mail_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Mail_historiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Mail_historiesAggregateArgs>(args: Subset<T, Mail_historiesAggregateArgs>): Prisma.PrismaPromise<GetMail_historiesAggregateType<T>>

    /**
     * Group by Mail_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mail_historiesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends mail_historiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: mail_historiesGroupByArgs['orderBy'] }
        : { orderBy?: mail_historiesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, mail_historiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMail_historiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the mail_histories model
   */
  readonly fields: mail_historiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for mail_histories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__mail_historiesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the mail_histories model
   */
  interface mail_historiesFieldRefs {
    readonly id: FieldRef<"mail_histories", 'String'>
    readonly user_id: FieldRef<"mail_histories", 'String'>
    readonly audit_log_id: FieldRef<"mail_histories", 'String'>
    readonly scene: FieldRef<"mail_histories", 'String'>
    readonly tone: FieldRef<"mail_histories", 'String'>
    readonly recipient_name: FieldRef<"mail_histories", 'String'>
    readonly recipient_role: FieldRef<"mail_histories", 'String'>
    readonly sender_name: FieldRef<"mail_histories", 'String'>
    readonly core_points: FieldRef<"mail_histories", 'String'>
    readonly mail_content: FieldRef<"mail_histories", 'String'>
    readonly is_favorite: FieldRef<"mail_histories", 'Boolean'>
    readonly is_deleted: FieldRef<"mail_histories", 'Boolean'>
    readonly created_time: FieldRef<"mail_histories", 'DateTime'>
    readonly updated_time: FieldRef<"mail_histories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * mail_histories findUnique
   */
  export type mail_historiesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter, which mail_histories to fetch.
     */
    where: mail_historiesWhereUniqueInput
  }

  /**
   * mail_histories findUniqueOrThrow
   */
  export type mail_historiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter, which mail_histories to fetch.
     */
    where: mail_historiesWhereUniqueInput
  }

  /**
   * mail_histories findFirst
   */
  export type mail_historiesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter, which mail_histories to fetch.
     */
    where?: mail_historiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mail_histories to fetch.
     */
    orderBy?: mail_historiesOrderByWithRelationInput | mail_historiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mail_histories.
     */
    cursor?: mail_historiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mail_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mail_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mail_histories.
     */
    distinct?: Mail_historiesScalarFieldEnum | Mail_historiesScalarFieldEnum[]
  }

  /**
   * mail_histories findFirstOrThrow
   */
  export type mail_historiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter, which mail_histories to fetch.
     */
    where?: mail_historiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mail_histories to fetch.
     */
    orderBy?: mail_historiesOrderByWithRelationInput | mail_historiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mail_histories.
     */
    cursor?: mail_historiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mail_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mail_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mail_histories.
     */
    distinct?: Mail_historiesScalarFieldEnum | Mail_historiesScalarFieldEnum[]
  }

  /**
   * mail_histories findMany
   */
  export type mail_historiesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter, which mail_histories to fetch.
     */
    where?: mail_historiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mail_histories to fetch.
     */
    orderBy?: mail_historiesOrderByWithRelationInput | mail_historiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing mail_histories.
     */
    cursor?: mail_historiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mail_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mail_histories.
     */
    skip?: number
    distinct?: Mail_historiesScalarFieldEnum | Mail_historiesScalarFieldEnum[]
  }

  /**
   * mail_histories create
   */
  export type mail_historiesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * The data needed to create a mail_histories.
     */
    data: XOR<mail_historiesCreateInput, mail_historiesUncheckedCreateInput>
  }

  /**
   * mail_histories createMany
   */
  export type mail_historiesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many mail_histories.
     */
    data: mail_historiesCreateManyInput | mail_historiesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * mail_histories createManyAndReturn
   */
  export type mail_historiesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * The data used to create many mail_histories.
     */
    data: mail_historiesCreateManyInput | mail_historiesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * mail_histories update
   */
  export type mail_historiesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * The data needed to update a mail_histories.
     */
    data: XOR<mail_historiesUpdateInput, mail_historiesUncheckedUpdateInput>
    /**
     * Choose, which mail_histories to update.
     */
    where: mail_historiesWhereUniqueInput
  }

  /**
   * mail_histories updateMany
   */
  export type mail_historiesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update mail_histories.
     */
    data: XOR<mail_historiesUpdateManyMutationInput, mail_historiesUncheckedUpdateManyInput>
    /**
     * Filter which mail_histories to update
     */
    where?: mail_historiesWhereInput
    /**
     * Limit how many mail_histories to update.
     */
    limit?: number
  }

  /**
   * mail_histories updateManyAndReturn
   */
  export type mail_historiesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * The data used to update mail_histories.
     */
    data: XOR<mail_historiesUpdateManyMutationInput, mail_historiesUncheckedUpdateManyInput>
    /**
     * Filter which mail_histories to update
     */
    where?: mail_historiesWhereInput
    /**
     * Limit how many mail_histories to update.
     */
    limit?: number
  }

  /**
   * mail_histories upsert
   */
  export type mail_historiesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * The filter to search for the mail_histories to update in case it exists.
     */
    where: mail_historiesWhereUniqueInput
    /**
     * In case the mail_histories found by the `where` argument doesn't exist, create a new mail_histories with this data.
     */
    create: XOR<mail_historiesCreateInput, mail_historiesUncheckedCreateInput>
    /**
     * In case the mail_histories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<mail_historiesUpdateInput, mail_historiesUncheckedUpdateInput>
  }

  /**
   * mail_histories delete
   */
  export type mail_historiesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
    /**
     * Filter which mail_histories to delete.
     */
    where: mail_historiesWhereUniqueInput
  }

  /**
   * mail_histories deleteMany
   */
  export type mail_historiesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mail_histories to delete
     */
    where?: mail_historiesWhereInput
    /**
     * Limit how many mail_histories to delete.
     */
    limit?: number
  }

  /**
   * mail_histories without action
   */
  export type mail_historiesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mail_histories
     */
    select?: mail_historiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mail_histories
     */
    omit?: mail_historiesOmit<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    role: number | null
    status: number | null
  }

  export type UsersSumAggregateOutputType = {
    role: number | null
    status: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    phone: string | null
    password_hash: string | null
    role: number | null
    status: number | null
    last_login_ip: string | null
    last_login_time: Date | null
    created_time: Date | null
    updated_time: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    password_hash: string | null
    role: number | null
    status: number | null
    last_login_ip: string | null
    last_login_time: Date | null
    created_time: Date | null
    updated_time: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    phone: number
    password_hash: number
    role: number
    status: number
    last_login_ip: number
    last_login_time: number
    created_time: number
    updated_time: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    role?: true
    status?: true
  }

  export type UsersSumAggregateInputType = {
    role?: true
    status?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    phone?: true
    password_hash?: true
    role?: true
    status?: true
    last_login_ip?: true
    last_login_time?: true
    created_time?: true
    updated_time?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    phone?: true
    password_hash?: true
    role?: true
    status?: true
    last_login_ip?: true
    last_login_time?: true
    created_time?: true
    updated_time?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    phone?: true
    password_hash?: true
    role?: true
    status?: true
    last_login_ip?: true
    last_login_time?: true
    created_time?: true
    updated_time?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    phone: string
    password_hash: string | null
    role: number | null
    status: number | null
    last_login_ip: string | null
    last_login_time: Date | null
    created_time: Date | null
    updated_time: Date | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    status?: boolean
    last_login_ip?: boolean
    last_login_time?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    status?: boolean
    last_login_ip?: boolean
    last_login_time?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    status?: boolean
    last_login_ip?: boolean
    last_login_time?: boolean
    created_time?: boolean
    updated_time?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    status?: boolean
    last_login_ip?: boolean
    last_login_time?: boolean
    created_time?: boolean
    updated_time?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "password_hash" | "role" | "status" | "last_login_ip" | "last_login_time" | "created_time" | "updated_time", ExtArgs["result"]["users"]>

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      password_hash: string | null
      role: number | null
      status: number | null
      last_login_ip: string | null
      last_login_time: Date | null
      created_time: Date | null
      updated_time: Date | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'String'>
    readonly phone: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly role: FieldRef<"users", 'Int'>
    readonly status: FieldRef<"users", 'Int'>
    readonly last_login_ip: FieldRef<"users", 'String'>
    readonly last_login_time: FieldRef<"users", 'DateTime'>
    readonly created_time: FieldRef<"users", 'DateTime'>
    readonly updated_time: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Admin_operation_logsScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    action_type: 'action_type',
    user_id: 'user_id',
    audit_id: 'audit_id',
    detail: 'detail',
    ip: 'ip',
    created_time: 'created_time'
  };

  export type Admin_operation_logsScalarFieldEnum = (typeof Admin_operation_logsScalarFieldEnum)[keyof typeof Admin_operation_logsScalarFieldEnum]


  export const Audit_logsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    user_phone: 'user_phone',
    user_ip: 'user_ip',
    scene: 'scene',
    tone: 'tone',
    input_prompt: 'input_prompt',
    output_content: 'output_content',
    model_name: 'model_name',
    audit_token: 'audit_token',
    status: 'status',
    is_sensitive: 'is_sensitive',
    external_audit_id: 'external_audit_id',
    created_time: 'created_time'
  };

  export type Audit_logsScalarFieldEnum = (typeof Audit_logsScalarFieldEnum)[keyof typeof Audit_logsScalarFieldEnum]


  export const FeedbacksScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    log_id: 'log_id',
    type: 'type',
    content: 'content',
    status: 'status',
    admin_note: 'admin_note',
    processed_time: 'processed_time',
    created_time: 'created_time'
  };

  export type FeedbacksScalarFieldEnum = (typeof FeedbacksScalarFieldEnum)[keyof typeof FeedbacksScalarFieldEnum]


  export const Mail_historiesScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    audit_log_id: 'audit_log_id',
    scene: 'scene',
    tone: 'tone',
    recipient_name: 'recipient_name',
    recipient_role: 'recipient_role',
    sender_name: 'sender_name',
    core_points: 'core_points',
    mail_content: 'mail_content',
    is_favorite: 'is_favorite',
    is_deleted: 'is_deleted',
    created_time: 'created_time',
    updated_time: 'updated_time'
  };

  export type Mail_historiesScalarFieldEnum = (typeof Mail_historiesScalarFieldEnum)[keyof typeof Mail_historiesScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    password_hash: 'password_hash',
    role: 'role',
    status: 'status',
    last_login_ip: 'last_login_ip',
    last_login_time: 'last_login_time',
    created_time: 'created_time',
    updated_time: 'updated_time'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type admin_operation_logsWhereInput = {
    AND?: admin_operation_logsWhereInput | admin_operation_logsWhereInput[]
    OR?: admin_operation_logsWhereInput[]
    NOT?: admin_operation_logsWhereInput | admin_operation_logsWhereInput[]
    id?: UuidFilter<"admin_operation_logs"> | string
    admin_id?: UuidFilter<"admin_operation_logs"> | string
    action_type?: StringFilter<"admin_operation_logs"> | string
    user_id?: UuidNullableFilter<"admin_operation_logs"> | string | null
    audit_id?: UuidNullableFilter<"admin_operation_logs"> | string | null
    detail?: StringNullableFilter<"admin_operation_logs"> | string | null
    ip?: StringNullableFilter<"admin_operation_logs"> | string | null
    created_time?: DateTimeNullableFilter<"admin_operation_logs"> | Date | string | null
  }

  export type admin_operation_logsOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    action_type?: SortOrder
    user_id?: SortOrderInput | SortOrder
    audit_id?: SortOrderInput | SortOrder
    detail?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
  }

  export type admin_operation_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: admin_operation_logsWhereInput | admin_operation_logsWhereInput[]
    OR?: admin_operation_logsWhereInput[]
    NOT?: admin_operation_logsWhereInput | admin_operation_logsWhereInput[]
    admin_id?: UuidFilter<"admin_operation_logs"> | string
    action_type?: StringFilter<"admin_operation_logs"> | string
    user_id?: UuidNullableFilter<"admin_operation_logs"> | string | null
    audit_id?: UuidNullableFilter<"admin_operation_logs"> | string | null
    detail?: StringNullableFilter<"admin_operation_logs"> | string | null
    ip?: StringNullableFilter<"admin_operation_logs"> | string | null
    created_time?: DateTimeNullableFilter<"admin_operation_logs"> | Date | string | null
  }, "id">

  export type admin_operation_logsOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    action_type?: SortOrder
    user_id?: SortOrderInput | SortOrder
    audit_id?: SortOrderInput | SortOrder
    detail?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    _count?: admin_operation_logsCountOrderByAggregateInput
    _max?: admin_operation_logsMaxOrderByAggregateInput
    _min?: admin_operation_logsMinOrderByAggregateInput
  }

  export type admin_operation_logsScalarWhereWithAggregatesInput = {
    AND?: admin_operation_logsScalarWhereWithAggregatesInput | admin_operation_logsScalarWhereWithAggregatesInput[]
    OR?: admin_operation_logsScalarWhereWithAggregatesInput[]
    NOT?: admin_operation_logsScalarWhereWithAggregatesInput | admin_operation_logsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"admin_operation_logs"> | string
    admin_id?: UuidWithAggregatesFilter<"admin_operation_logs"> | string
    action_type?: StringWithAggregatesFilter<"admin_operation_logs"> | string
    user_id?: UuidNullableWithAggregatesFilter<"admin_operation_logs"> | string | null
    audit_id?: UuidNullableWithAggregatesFilter<"admin_operation_logs"> | string | null
    detail?: StringNullableWithAggregatesFilter<"admin_operation_logs"> | string | null
    ip?: StringNullableWithAggregatesFilter<"admin_operation_logs"> | string | null
    created_time?: DateTimeNullableWithAggregatesFilter<"admin_operation_logs"> | Date | string | null
  }

  export type audit_logsWhereInput = {
    AND?: audit_logsWhereInput | audit_logsWhereInput[]
    OR?: audit_logsWhereInput[]
    NOT?: audit_logsWhereInput | audit_logsWhereInput[]
    id?: UuidFilter<"audit_logs"> | string
    user_id?: UuidFilter<"audit_logs"> | string
    user_phone?: StringNullableFilter<"audit_logs"> | string | null
    user_ip?: StringFilter<"audit_logs"> | string
    scene?: StringNullableFilter<"audit_logs"> | string | null
    tone?: StringNullableFilter<"audit_logs"> | string | null
    input_prompt?: StringFilter<"audit_logs"> | string
    output_content?: StringFilter<"audit_logs"> | string
    model_name?: StringNullableFilter<"audit_logs"> | string | null
    audit_token?: StringNullableFilter<"audit_logs"> | string | null
    status?: IntNullableFilter<"audit_logs"> | number | null
    is_sensitive?: BoolNullableFilter<"audit_logs"> | boolean | null
    external_audit_id?: StringNullableFilter<"audit_logs"> | string | null
    created_time?: DateTimeNullableFilter<"audit_logs"> | Date | string | null
  }

  export type audit_logsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_phone?: SortOrderInput | SortOrder
    user_ip?: SortOrder
    scene?: SortOrderInput | SortOrder
    tone?: SortOrderInput | SortOrder
    input_prompt?: SortOrder
    output_content?: SortOrder
    model_name?: SortOrderInput | SortOrder
    audit_token?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    is_sensitive?: SortOrderInput | SortOrder
    external_audit_id?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
  }

  export type audit_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: audit_logsWhereInput | audit_logsWhereInput[]
    OR?: audit_logsWhereInput[]
    NOT?: audit_logsWhereInput | audit_logsWhereInput[]
    user_id?: UuidFilter<"audit_logs"> | string
    user_phone?: StringNullableFilter<"audit_logs"> | string | null
    user_ip?: StringFilter<"audit_logs"> | string
    scene?: StringNullableFilter<"audit_logs"> | string | null
    tone?: StringNullableFilter<"audit_logs"> | string | null
    input_prompt?: StringFilter<"audit_logs"> | string
    output_content?: StringFilter<"audit_logs"> | string
    model_name?: StringNullableFilter<"audit_logs"> | string | null
    audit_token?: StringNullableFilter<"audit_logs"> | string | null
    status?: IntNullableFilter<"audit_logs"> | number | null
    is_sensitive?: BoolNullableFilter<"audit_logs"> | boolean | null
    external_audit_id?: StringNullableFilter<"audit_logs"> | string | null
    created_time?: DateTimeNullableFilter<"audit_logs"> | Date | string | null
  }, "id">

  export type audit_logsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_phone?: SortOrderInput | SortOrder
    user_ip?: SortOrder
    scene?: SortOrderInput | SortOrder
    tone?: SortOrderInput | SortOrder
    input_prompt?: SortOrder
    output_content?: SortOrder
    model_name?: SortOrderInput | SortOrder
    audit_token?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    is_sensitive?: SortOrderInput | SortOrder
    external_audit_id?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    _count?: audit_logsCountOrderByAggregateInput
    _avg?: audit_logsAvgOrderByAggregateInput
    _max?: audit_logsMaxOrderByAggregateInput
    _min?: audit_logsMinOrderByAggregateInput
    _sum?: audit_logsSumOrderByAggregateInput
  }

  export type audit_logsScalarWhereWithAggregatesInput = {
    AND?: audit_logsScalarWhereWithAggregatesInput | audit_logsScalarWhereWithAggregatesInput[]
    OR?: audit_logsScalarWhereWithAggregatesInput[]
    NOT?: audit_logsScalarWhereWithAggregatesInput | audit_logsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"audit_logs"> | string
    user_id?: UuidWithAggregatesFilter<"audit_logs"> | string
    user_phone?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    user_ip?: StringWithAggregatesFilter<"audit_logs"> | string
    scene?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    tone?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    input_prompt?: StringWithAggregatesFilter<"audit_logs"> | string
    output_content?: StringWithAggregatesFilter<"audit_logs"> | string
    model_name?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    audit_token?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    status?: IntNullableWithAggregatesFilter<"audit_logs"> | number | null
    is_sensitive?: BoolNullableWithAggregatesFilter<"audit_logs"> | boolean | null
    external_audit_id?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    created_time?: DateTimeNullableWithAggregatesFilter<"audit_logs"> | Date | string | null
  }

  export type feedbacksWhereInput = {
    AND?: feedbacksWhereInput | feedbacksWhereInput[]
    OR?: feedbacksWhereInput[]
    NOT?: feedbacksWhereInput | feedbacksWhereInput[]
    id?: UuidFilter<"feedbacks"> | string
    user_id?: UuidFilter<"feedbacks"> | string
    log_id?: UuidNullableFilter<"feedbacks"> | string | null
    type?: StringFilter<"feedbacks"> | string
    content?: StringFilter<"feedbacks"> | string
    status?: IntNullableFilter<"feedbacks"> | number | null
    admin_note?: StringNullableFilter<"feedbacks"> | string | null
    processed_time?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
    created_time?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
  }

  export type feedbacksOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    log_id?: SortOrderInput | SortOrder
    type?: SortOrder
    content?: SortOrder
    status?: SortOrderInput | SortOrder
    admin_note?: SortOrderInput | SortOrder
    processed_time?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
  }

  export type feedbacksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: feedbacksWhereInput | feedbacksWhereInput[]
    OR?: feedbacksWhereInput[]
    NOT?: feedbacksWhereInput | feedbacksWhereInput[]
    user_id?: UuidFilter<"feedbacks"> | string
    log_id?: UuidNullableFilter<"feedbacks"> | string | null
    type?: StringFilter<"feedbacks"> | string
    content?: StringFilter<"feedbacks"> | string
    status?: IntNullableFilter<"feedbacks"> | number | null
    admin_note?: StringNullableFilter<"feedbacks"> | string | null
    processed_time?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
    created_time?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
  }, "id">

  export type feedbacksOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    log_id?: SortOrderInput | SortOrder
    type?: SortOrder
    content?: SortOrder
    status?: SortOrderInput | SortOrder
    admin_note?: SortOrderInput | SortOrder
    processed_time?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    _count?: feedbacksCountOrderByAggregateInput
    _avg?: feedbacksAvgOrderByAggregateInput
    _max?: feedbacksMaxOrderByAggregateInput
    _min?: feedbacksMinOrderByAggregateInput
    _sum?: feedbacksSumOrderByAggregateInput
  }

  export type feedbacksScalarWhereWithAggregatesInput = {
    AND?: feedbacksScalarWhereWithAggregatesInput | feedbacksScalarWhereWithAggregatesInput[]
    OR?: feedbacksScalarWhereWithAggregatesInput[]
    NOT?: feedbacksScalarWhereWithAggregatesInput | feedbacksScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"feedbacks"> | string
    user_id?: UuidWithAggregatesFilter<"feedbacks"> | string
    log_id?: UuidNullableWithAggregatesFilter<"feedbacks"> | string | null
    type?: StringWithAggregatesFilter<"feedbacks"> | string
    content?: StringWithAggregatesFilter<"feedbacks"> | string
    status?: IntNullableWithAggregatesFilter<"feedbacks"> | number | null
    admin_note?: StringNullableWithAggregatesFilter<"feedbacks"> | string | null
    processed_time?: DateTimeNullableWithAggregatesFilter<"feedbacks"> | Date | string | null
    created_time?: DateTimeNullableWithAggregatesFilter<"feedbacks"> | Date | string | null
  }

  export type mail_historiesWhereInput = {
    AND?: mail_historiesWhereInput | mail_historiesWhereInput[]
    OR?: mail_historiesWhereInput[]
    NOT?: mail_historiesWhereInput | mail_historiesWhereInput[]
    id?: UuidFilter<"mail_histories"> | string
    user_id?: UuidFilter<"mail_histories"> | string
    audit_log_id?: UuidNullableFilter<"mail_histories"> | string | null
    scene?: StringNullableFilter<"mail_histories"> | string | null
    tone?: StringNullableFilter<"mail_histories"> | string | null
    recipient_name?: StringNullableFilter<"mail_histories"> | string | null
    recipient_role?: StringNullableFilter<"mail_histories"> | string | null
    sender_name?: StringNullableFilter<"mail_histories"> | string | null
    core_points?: StringNullableFilter<"mail_histories"> | string | null
    mail_content?: StringFilter<"mail_histories"> | string
    is_favorite?: BoolNullableFilter<"mail_histories"> | boolean | null
    is_deleted?: BoolNullableFilter<"mail_histories"> | boolean | null
    created_time?: DateTimeNullableFilter<"mail_histories"> | Date | string | null
    updated_time?: DateTimeNullableFilter<"mail_histories"> | Date | string | null
  }

  export type mail_historiesOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    audit_log_id?: SortOrderInput | SortOrder
    scene?: SortOrderInput | SortOrder
    tone?: SortOrderInput | SortOrder
    recipient_name?: SortOrderInput | SortOrder
    recipient_role?: SortOrderInput | SortOrder
    sender_name?: SortOrderInput | SortOrder
    core_points?: SortOrderInput | SortOrder
    mail_content?: SortOrder
    is_favorite?: SortOrderInput | SortOrder
    is_deleted?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    updated_time?: SortOrderInput | SortOrder
  }

  export type mail_historiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: mail_historiesWhereInput | mail_historiesWhereInput[]
    OR?: mail_historiesWhereInput[]
    NOT?: mail_historiesWhereInput | mail_historiesWhereInput[]
    user_id?: UuidFilter<"mail_histories"> | string
    audit_log_id?: UuidNullableFilter<"mail_histories"> | string | null
    scene?: StringNullableFilter<"mail_histories"> | string | null
    tone?: StringNullableFilter<"mail_histories"> | string | null
    recipient_name?: StringNullableFilter<"mail_histories"> | string | null
    recipient_role?: StringNullableFilter<"mail_histories"> | string | null
    sender_name?: StringNullableFilter<"mail_histories"> | string | null
    core_points?: StringNullableFilter<"mail_histories"> | string | null
    mail_content?: StringFilter<"mail_histories"> | string
    is_favorite?: BoolNullableFilter<"mail_histories"> | boolean | null
    is_deleted?: BoolNullableFilter<"mail_histories"> | boolean | null
    created_time?: DateTimeNullableFilter<"mail_histories"> | Date | string | null
    updated_time?: DateTimeNullableFilter<"mail_histories"> | Date | string | null
  }, "id">

  export type mail_historiesOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    audit_log_id?: SortOrderInput | SortOrder
    scene?: SortOrderInput | SortOrder
    tone?: SortOrderInput | SortOrder
    recipient_name?: SortOrderInput | SortOrder
    recipient_role?: SortOrderInput | SortOrder
    sender_name?: SortOrderInput | SortOrder
    core_points?: SortOrderInput | SortOrder
    mail_content?: SortOrder
    is_favorite?: SortOrderInput | SortOrder
    is_deleted?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    updated_time?: SortOrderInput | SortOrder
    _count?: mail_historiesCountOrderByAggregateInput
    _max?: mail_historiesMaxOrderByAggregateInput
    _min?: mail_historiesMinOrderByAggregateInput
  }

  export type mail_historiesScalarWhereWithAggregatesInput = {
    AND?: mail_historiesScalarWhereWithAggregatesInput | mail_historiesScalarWhereWithAggregatesInput[]
    OR?: mail_historiesScalarWhereWithAggregatesInput[]
    NOT?: mail_historiesScalarWhereWithAggregatesInput | mail_historiesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"mail_histories"> | string
    user_id?: UuidWithAggregatesFilter<"mail_histories"> | string
    audit_log_id?: UuidNullableWithAggregatesFilter<"mail_histories"> | string | null
    scene?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    tone?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    recipient_name?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    recipient_role?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    sender_name?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    core_points?: StringNullableWithAggregatesFilter<"mail_histories"> | string | null
    mail_content?: StringWithAggregatesFilter<"mail_histories"> | string
    is_favorite?: BoolNullableWithAggregatesFilter<"mail_histories"> | boolean | null
    is_deleted?: BoolNullableWithAggregatesFilter<"mail_histories"> | boolean | null
    created_time?: DateTimeNullableWithAggregatesFilter<"mail_histories"> | Date | string | null
    updated_time?: DateTimeNullableWithAggregatesFilter<"mail_histories"> | Date | string | null
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: UuidFilter<"users"> | string
    phone?: StringFilter<"users"> | string
    password_hash?: StringNullableFilter<"users"> | string | null
    role?: IntNullableFilter<"users"> | number | null
    status?: IntNullableFilter<"users"> | number | null
    last_login_ip?: StringNullableFilter<"users"> | string | null
    last_login_time?: DateTimeNullableFilter<"users"> | Date | string | null
    created_time?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_time?: DateTimeNullableFilter<"users"> | Date | string | null
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    last_login_ip?: SortOrderInput | SortOrder
    last_login_time?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    updated_time?: SortOrderInput | SortOrder
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    password_hash?: StringNullableFilter<"users"> | string | null
    role?: IntNullableFilter<"users"> | number | null
    status?: IntNullableFilter<"users"> | number | null
    last_login_ip?: StringNullableFilter<"users"> | string | null
    last_login_time?: DateTimeNullableFilter<"users"> | Date | string | null
    created_time?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_time?: DateTimeNullableFilter<"users"> | Date | string | null
  }, "id" | "phone">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    last_login_ip?: SortOrderInput | SortOrder
    last_login_time?: SortOrderInput | SortOrder
    created_time?: SortOrderInput | SortOrder
    updated_time?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"users"> | string
    phone?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringNullableWithAggregatesFilter<"users"> | string | null
    role?: IntNullableWithAggregatesFilter<"users"> | number | null
    status?: IntNullableWithAggregatesFilter<"users"> | number | null
    last_login_ip?: StringNullableWithAggregatesFilter<"users"> | string | null
    last_login_time?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    created_time?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    updated_time?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
  }

  export type admin_operation_logsCreateInput = {
    id?: string
    admin_id: string
    action_type: string
    user_id?: string | null
    audit_id?: string | null
    detail?: string | null
    ip?: string | null
    created_time?: Date | string | null
  }

  export type admin_operation_logsUncheckedCreateInput = {
    id?: string
    admin_id: string
    action_type: string
    user_id?: string | null
    audit_id?: string | null
    detail?: string | null
    ip?: string | null
    created_time?: Date | string | null
  }

  export type admin_operation_logsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    admin_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type admin_operation_logsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    admin_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type admin_operation_logsCreateManyInput = {
    id?: string
    admin_id: string
    action_type: string
    user_id?: string | null
    audit_id?: string | null
    detail?: string | null
    ip?: string | null
    created_time?: Date | string | null
  }

  export type admin_operation_logsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    admin_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type admin_operation_logsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    admin_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsCreateInput = {
    id?: string
    user_id: string
    user_phone?: string | null
    user_ip: string
    scene?: string | null
    tone?: string | null
    input_prompt: string
    output_content: string
    model_name?: string | null
    audit_token?: string | null
    status?: number | null
    is_sensitive?: boolean | null
    external_audit_id?: string | null
    created_time?: Date | string | null
  }

  export type audit_logsUncheckedCreateInput = {
    id?: string
    user_id: string
    user_phone?: string | null
    user_ip: string
    scene?: string | null
    tone?: string | null
    input_prompt: string
    output_content: string
    model_name?: string | null
    audit_token?: string | null
    status?: number | null
    is_sensitive?: boolean | null
    external_audit_id?: string | null
    created_time?: Date | string | null
  }

  export type audit_logsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_phone?: NullableStringFieldUpdateOperationsInput | string | null
    user_ip?: StringFieldUpdateOperationsInput | string
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    input_prompt?: StringFieldUpdateOperationsInput | string
    output_content?: StringFieldUpdateOperationsInput | string
    model_name?: NullableStringFieldUpdateOperationsInput | string | null
    audit_token?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    is_sensitive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    external_audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_phone?: NullableStringFieldUpdateOperationsInput | string | null
    user_ip?: StringFieldUpdateOperationsInput | string
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    input_prompt?: StringFieldUpdateOperationsInput | string
    output_content?: StringFieldUpdateOperationsInput | string
    model_name?: NullableStringFieldUpdateOperationsInput | string | null
    audit_token?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    is_sensitive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    external_audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsCreateManyInput = {
    id?: string
    user_id: string
    user_phone?: string | null
    user_ip: string
    scene?: string | null
    tone?: string | null
    input_prompt: string
    output_content: string
    model_name?: string | null
    audit_token?: string | null
    status?: number | null
    is_sensitive?: boolean | null
    external_audit_id?: string | null
    created_time?: Date | string | null
  }

  export type audit_logsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_phone?: NullableStringFieldUpdateOperationsInput | string | null
    user_ip?: StringFieldUpdateOperationsInput | string
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    input_prompt?: StringFieldUpdateOperationsInput | string
    output_content?: StringFieldUpdateOperationsInput | string
    model_name?: NullableStringFieldUpdateOperationsInput | string | null
    audit_token?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    is_sensitive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    external_audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_phone?: NullableStringFieldUpdateOperationsInput | string | null
    user_ip?: StringFieldUpdateOperationsInput | string
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    input_prompt?: StringFieldUpdateOperationsInput | string
    output_content?: StringFieldUpdateOperationsInput | string
    model_name?: NullableStringFieldUpdateOperationsInput | string | null
    audit_token?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    is_sensitive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    external_audit_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksCreateInput = {
    id?: string
    user_id: string
    log_id?: string | null
    type: string
    content: string
    status?: number | null
    admin_note?: string | null
    processed_time?: Date | string | null
    created_time?: Date | string | null
  }

  export type feedbacksUncheckedCreateInput = {
    id?: string
    user_id: string
    log_id?: string | null
    type: string
    content: string
    status?: number | null
    admin_note?: string | null
    processed_time?: Date | string | null
    created_time?: Date | string | null
  }

  export type feedbacksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: NullableIntFieldUpdateOperationsInput | number | null
    admin_note?: NullableStringFieldUpdateOperationsInput | string | null
    processed_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: NullableIntFieldUpdateOperationsInput | number | null
    admin_note?: NullableStringFieldUpdateOperationsInput | string | null
    processed_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksCreateManyInput = {
    id?: string
    user_id: string
    log_id?: string | null
    type: string
    content: string
    status?: number | null
    admin_note?: string | null
    processed_time?: Date | string | null
    created_time?: Date | string | null
  }

  export type feedbacksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: NullableIntFieldUpdateOperationsInput | number | null
    admin_note?: NullableStringFieldUpdateOperationsInput | string | null
    processed_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: NullableIntFieldUpdateOperationsInput | number | null
    admin_note?: NullableStringFieldUpdateOperationsInput | string | null
    processed_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type mail_historiesCreateInput = {
    id?: string
    user_id: string
    audit_log_id?: string | null
    scene?: string | null
    tone?: string | null
    recipient_name?: string | null
    recipient_role?: string | null
    sender_name?: string | null
    core_points?: string | null
    mail_content: string
    is_favorite?: boolean | null
    is_deleted?: boolean | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type mail_historiesUncheckedCreateInput = {
    id?: string
    user_id: string
    audit_log_id?: string | null
    scene?: string | null
    tone?: string | null
    recipient_name?: string | null
    recipient_role?: string | null
    sender_name?: string | null
    core_points?: string | null
    mail_content: string
    is_favorite?: boolean | null
    is_deleted?: boolean | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type mail_historiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    audit_log_id?: NullableStringFieldUpdateOperationsInput | string | null
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_name?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_role?: NullableStringFieldUpdateOperationsInput | string | null
    sender_name?: NullableStringFieldUpdateOperationsInput | string | null
    core_points?: NullableStringFieldUpdateOperationsInput | string | null
    mail_content?: StringFieldUpdateOperationsInput | string
    is_favorite?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_deleted?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type mail_historiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    audit_log_id?: NullableStringFieldUpdateOperationsInput | string | null
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_name?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_role?: NullableStringFieldUpdateOperationsInput | string | null
    sender_name?: NullableStringFieldUpdateOperationsInput | string | null
    core_points?: NullableStringFieldUpdateOperationsInput | string | null
    mail_content?: StringFieldUpdateOperationsInput | string
    is_favorite?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_deleted?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type mail_historiesCreateManyInput = {
    id?: string
    user_id: string
    audit_log_id?: string | null
    scene?: string | null
    tone?: string | null
    recipient_name?: string | null
    recipient_role?: string | null
    sender_name?: string | null
    core_points?: string | null
    mail_content: string
    is_favorite?: boolean | null
    is_deleted?: boolean | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type mail_historiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    audit_log_id?: NullableStringFieldUpdateOperationsInput | string | null
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_name?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_role?: NullableStringFieldUpdateOperationsInput | string | null
    sender_name?: NullableStringFieldUpdateOperationsInput | string | null
    core_points?: NullableStringFieldUpdateOperationsInput | string | null
    mail_content?: StringFieldUpdateOperationsInput | string
    is_favorite?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_deleted?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type mail_historiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    audit_log_id?: NullableStringFieldUpdateOperationsInput | string | null
    scene?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_name?: NullableStringFieldUpdateOperationsInput | string | null
    recipient_role?: NullableStringFieldUpdateOperationsInput | string | null
    sender_name?: NullableStringFieldUpdateOperationsInput | string | null
    core_points?: NullableStringFieldUpdateOperationsInput | string | null
    mail_content?: StringFieldUpdateOperationsInput | string
    is_favorite?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_deleted?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateInput = {
    id?: string
    phone: string
    password_hash?: string | null
    role?: number | null
    status?: number | null
    last_login_ip?: string | null
    last_login_time?: Date | string | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type usersUncheckedCreateInput = {
    id?: string
    phone: string
    password_hash?: string | null
    role?: number | null
    status?: number | null
    last_login_ip?: string | null
    last_login_time?: Date | string | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    last_login_ip?: NullableStringFieldUpdateOperationsInput | string | null
    last_login_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    last_login_ip?: NullableStringFieldUpdateOperationsInput | string | null
    last_login_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateManyInput = {
    id?: string
    phone: string
    password_hash?: string | null
    role?: number | null
    status?: number | null
    last_login_ip?: string | null
    last_login_time?: Date | string | null
    created_time?: Date | string | null
    updated_time?: Date | string | null
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    last_login_ip?: NullableStringFieldUpdateOperationsInput | string | null
    last_login_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    last_login_ip?: NullableStringFieldUpdateOperationsInput | string | null
    last_login_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type admin_operation_logsCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    action_type?: SortOrder
    user_id?: SortOrder
    audit_id?: SortOrder
    detail?: SortOrder
    ip?: SortOrder
    created_time?: SortOrder
  }

  export type admin_operation_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    action_type?: SortOrder
    user_id?: SortOrder
    audit_id?: SortOrder
    detail?: SortOrder
    ip?: SortOrder
    created_time?: SortOrder
  }

  export type admin_operation_logsMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    action_type?: SortOrder
    user_id?: SortOrder
    audit_id?: SortOrder
    detail?: SortOrder
    ip?: SortOrder
    created_time?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type audit_logsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_phone?: SortOrder
    user_ip?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    input_prompt?: SortOrder
    output_content?: SortOrder
    model_name?: SortOrder
    audit_token?: SortOrder
    status?: SortOrder
    is_sensitive?: SortOrder
    external_audit_id?: SortOrder
    created_time?: SortOrder
  }

  export type audit_logsAvgOrderByAggregateInput = {
    status?: SortOrder
  }

  export type audit_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_phone?: SortOrder
    user_ip?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    input_prompt?: SortOrder
    output_content?: SortOrder
    model_name?: SortOrder
    audit_token?: SortOrder
    status?: SortOrder
    is_sensitive?: SortOrder
    external_audit_id?: SortOrder
    created_time?: SortOrder
  }

  export type audit_logsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_phone?: SortOrder
    user_ip?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    input_prompt?: SortOrder
    output_content?: SortOrder
    model_name?: SortOrder
    audit_token?: SortOrder
    status?: SortOrder
    is_sensitive?: SortOrder
    external_audit_id?: SortOrder
    created_time?: SortOrder
  }

  export type audit_logsSumOrderByAggregateInput = {
    status?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type feedbacksCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    log_id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    status?: SortOrder
    admin_note?: SortOrder
    processed_time?: SortOrder
    created_time?: SortOrder
  }

  export type feedbacksAvgOrderByAggregateInput = {
    status?: SortOrder
  }

  export type feedbacksMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    log_id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    status?: SortOrder
    admin_note?: SortOrder
    processed_time?: SortOrder
    created_time?: SortOrder
  }

  export type feedbacksMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    log_id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    status?: SortOrder
    admin_note?: SortOrder
    processed_time?: SortOrder
    created_time?: SortOrder
  }

  export type feedbacksSumOrderByAggregateInput = {
    status?: SortOrder
  }

  export type mail_historiesCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    audit_log_id?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    recipient_name?: SortOrder
    recipient_role?: SortOrder
    sender_name?: SortOrder
    core_points?: SortOrder
    mail_content?: SortOrder
    is_favorite?: SortOrder
    is_deleted?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type mail_historiesMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    audit_log_id?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    recipient_name?: SortOrder
    recipient_role?: SortOrder
    sender_name?: SortOrder
    core_points?: SortOrder
    mail_content?: SortOrder
    is_favorite?: SortOrder
    is_deleted?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type mail_historiesMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    audit_log_id?: SortOrder
    scene?: SortOrder
    tone?: SortOrder
    recipient_name?: SortOrder
    recipient_role?: SortOrder
    sender_name?: SortOrder
    core_points?: SortOrder
    mail_content?: SortOrder
    is_favorite?: SortOrder
    is_deleted?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    last_login_ip?: SortOrder
    last_login_time?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    role?: SortOrder
    status?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    last_login_ip?: SortOrder
    last_login_time?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    last_login_ip?: SortOrder
    last_login_time?: SortOrder
    created_time?: SortOrder
    updated_time?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    role?: SortOrder
    status?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}