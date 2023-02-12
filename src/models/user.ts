
export class user implements newUser {
    _id: string;
    username: string;

    constructor(username: string){
        this.username = username.toLowerCase();
        this._id = '0'
        getUser(this.username)
            .then(userdata => {
                this._id = userdata._id;
            })
            .catch(error => {
                console.warn("User not found, creating new user.");
                newUser(this.username)
                    .then(id => {
                        this._id = id;
                    })
                    .catch(error => {
                            throw(`Error creating user: ${error}`);
                        })
            })
    } 
}

export interface newUser{
    username: string;
};

export class users{
    users: user[];
    constructor(users: user[]){
        this.users = users;
    };
};

export async function getUser(username: string): Promise<user>{
    const res = await fetch('/api/users/' + username);
    if(res.status === 404){
        throw("User not found.")
    };
    const res_1 = await res.json();
    return res_1 as user;
};
export async function newUser(username: string): Promise<string>{
    const body = `{"username": "${username}"}`;
    var response: string
    await fetch('/api/users', { 
            method: "POST", 
            body: body,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            } 
        })
        .then(res => res.json())
        .then(res => response = res);
    return response!;
};
export async function deleteUser(username: string): Promise<void>{
    const body = `{"username": "${username}"}`;
    const res = await fetch('/api/users',{
        method: "DELETE",
        body: body,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if(res.status === 404){
        throw('Unable to delete user.')
    };
};