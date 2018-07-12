const kue = require('kue');

const send = async (type, data, connectionString) => {
  return new Promise((resolve, reject) => {
    const queue = kue.createQueue({
      redis: connectionString
    });
    queue.create(type, data)
      .save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
        try {
          queue.shutdown();
        } catch (e) {
        }
      });
  });
};

class PublicApiClient {
  constructor({ connectionString }) {
    this.connectionString = connectionString;
  }

  async sendInvitationRequest(firstName, lastName, email, organisation, sourceId, callback, userRedirect, clientId) {
    await send('publicinvitationrequest_v1', { firstName, lastName, email, organisation, sourceId, callback, userRedirect, clientId }, this.connectionString);
  }

  async sendInvitationComplete(userId, callbacks) {
    await send('publicinvitationcomplete_v1', { userId, callbacks }, this.connectionString);
  }

  async sendNotifyRelyingParty(callback, userId, sourceId) {
    await send('publicinvitationnotifyrelyingparty_v1', { callback, userId, sourceId }, this.connectionString);
  }
}

module.exports = PublicApiClient;