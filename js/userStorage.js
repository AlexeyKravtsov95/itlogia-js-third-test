export class UserStorage {
    constructor(key = "clients") {
        this.key = key;
        const raw = JSON.parse(localStorage.getItem(this.key)) || [];
        this.clients = Array.isArray(raw) ? raw : [raw];
    }

    byUsername(username) {
        return this.clients.some(client => client.username === username);
    }

    byEmail(email) {
        return this.clients.some(client => client.email === email);
    }

    save(user) {
        this.clients.push(user)
        localStorage.setItem(this.key, JSON.stringify(this.clients));
    }

    find(username) {
        return this.clients.find(client => client.username === username);
    }
}