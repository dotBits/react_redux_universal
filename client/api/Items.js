import { buildRequest } from './ApiBuilder'
import { isBrowser } from '../utils/index'

module.exports = {
  getList: function(params) {
    const url = (isBrowser()) ? '/api/v1/items/list':'http://localhost:3000/api/v1/items/list';
    return buildRequest('post', url, params);
  },

  getSingle: function(prmItemId) {
    const url = (isBrowser()) ? `/api/v1/items/single/${prmItemId}`:`http://localhost:3000/api/v1/items/single/${prmItemId}`;
    return buildRequest('put', url, {});
  },

  createItem: function(params) {
    const url = (isBrowser()) ? '/api/v1/items':'http://localhost:3000/api/v1/items';
    return buildRequest('post', url, params);
  },

  deleteItemList: function(params) {
    const url = (isBrowser()) ? '/api/v1/items/bulk-delete':'http://localhost:3000/api/v1/items/bulk-delete';
    return buildRequest('post', url, params);
  },

  getItemRoleList: function(params) {
    const url = (isBrowser()) ? '/api/v1/items-roles/list':'http://localhost:3000/api/v1/items-roles/list';
    return buildRequest('post', url, params);
  },

  getItemStatusList: function(params) {
    const url = (isBrowser()) ? '/api/v1/items-status/list':'http://localhost:3000/api/v1/items-status/list';
    return buildRequest('post', url, params);
  },
}
