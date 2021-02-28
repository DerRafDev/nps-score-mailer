import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid  } from 'uuid';

/*this is for getting to the Sqlite database, the data collected from the json
  file, or the user, if you want, for example, you can change the names here
  but don't forget to change also in, for example @Column(), for example:
    @Column("name") //as in the database is set as name
    nameUser: string; 
*/

@Entity("users")
class User {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { User } ;