import { Account } from "@application/entities/Account";

export class AccountItem {
  private readonly keys: AccountItem.Keys;
  private readonly type: AccountItem.ItemType["type"] = "Account";

  constructor(
    private readonly attr: AccountItem.Attributes,
  ) {

    this.keys = {
      PK: AccountItem.getPK(this.attr.id),
      SK: AccountItem.getSK(this.attr.id),
      GSI1PK: AccountItem.getGSI1PK(this.attr.email),
      GSI1SK: AccountItem.getGSI1SK(this.attr.email),
    }
  }

  toItem(): AccountItem.ItemType {
    return {
      ...this.attr,
      ...this.keys,
      type: this.type,
    }
  }

  static fromEntity(entity: Account) {
    return new AccountItem({
      ...entity,
      createdAt: entity.createdAt.toISOString(),
    })
  }

  static toEntity(item: AccountItem.ItemType): Account {
    return new Account({
      id: item.id,
      email: item.email,
      externalId: item.externalId,
      createdAt: new Date(item.createdAt),
    })
  }

  static getPK(accountId: string): AccountItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.Keys["SK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.Keys["GSI1PK"] {
    return `ACCOUNT#${email}`;
  }

  static getGSI1SK(email: string): AccountItem.Keys["GSI1SK"] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  }

  export type Attributes = {
    id: string;
    email: string;
    externalId: string;
    createdAt: string;
  }

  export type ItemType = Keys & Attributes & {
    type: "Account";
  }
}
