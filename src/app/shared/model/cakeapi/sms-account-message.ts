
import { AppModel } from './app.model';
import { Member } from './member';

export class SmsAccountMessage extends AppModel {

  public id: any;
  public _member: Member;
  public message: string;
  public to: string;
  public sent: number;
  public sent_at: string;
  public _sent_status: string;

  constructor(data) {
    super(data);
  }

  set member(value) {
    this._member = value ? new Member(value) : null;
  }

  get member(): Member {
    return this._member;
  }

  set sent_status(value) {
    this._sent_status = value;
  }

  get sent_status() {
    if (this.isPending()) {
      return 'Message Pending';
    }

    return this._sent_status;
  }

  isPending() {
    return !this.sent;
  }
}
