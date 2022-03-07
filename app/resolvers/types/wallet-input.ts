import { InputType, Field } from 'type-graphql';
import { __Type } from 'graphql';
import { RealmInput } from './realm-input';

@InputType()
export class WalletInput {
    @Field()
    address: string;

    @Field(() => RealmInput, { nullable: true })
    realms?: [RealmInput] | null
}

