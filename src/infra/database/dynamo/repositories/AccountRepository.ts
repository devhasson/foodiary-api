import { Account } from "@application/entities/Account";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamoClient";
import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/AppConfig";
import { AccountItem } from "../items/AccountItem";

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) { }

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account).toItem();

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamoDb.mainTable.name,
      Item: accountItem,
    })

    await dynamoClient.send(command);
  }

  async findByEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      IndexName: "GSI1",
      TableName: this.appConfig.database.dynamoDb.mainTable.name,
      Limit: 1,
      KeyConditionExpression: "#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK",
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
        "#GSI1SK": "GSI1SK",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": AccountItem.getGSI1PK(email),
        ":GSI1SK": AccountItem.getGSI1SK(email),
      }
    })

    const { Items = [], Count } = await dynamoClient.send(command);
    const [Item] = Items as AccountItem.ItemType[];

    if (Count === 0 || !Item) {
      return null;
    }


    return AccountItem.toEntity(Item);
  }

}
