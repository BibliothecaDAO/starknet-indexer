import { InputType, Field } from 'type-graphql';
import { Realm } from '../../entities/Realm';

@InputType()
export class RealmInput implements Partial<Realm> {
  @Field()
  name: string;
}
