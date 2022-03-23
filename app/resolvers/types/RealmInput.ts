import { InputType, Field } from 'type-graphql';

@InputType()
export class RealmInput {
  @Field()
  name: string;

  @Field()
  realmId: number;

  @Field()
  owner: string;
}
