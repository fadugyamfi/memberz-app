import { AppModel } from './app.model';
import * as moment from 'moment';

export class Notification extends AppModel {

    public id;
    public read_at;
    public data: object;
    public sent: number;
    public created_at;

    constructor(data = {}) {
        super(data);
    }

    get title() {
        return this.data['title'] || '';
    }

    get message() {
        return this.data['message'] || '';
    }

    get action() {
        return this.data['action'] || '';
    }

    timeAgo() {
        return moment(this.created_at).fromNow();
    }

    get user() {
        return this.data['user'] || {};
    }
}
