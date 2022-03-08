import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';

@ObjectType({ description: 'The Squad Model' })
export class Squad {
    @Field(() => ID)
    id: number

    @Field()
    realmId: number;
}

