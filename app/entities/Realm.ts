import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';

@ObjectType({ description: 'The Realm Model' })
export class Realm {
  @Field(() => ID)
  id: String;

  @Field()
  name: string;
}

