import AddApiKeyFormHandler from './Modules/ApiKeyHandlers/AddApiKeyFormHandler.js';
import EditApiKeyFormHandler from './Modules/ApiKeyHandlers/EditApiKeyFormHandler.js';
import ApiKeyListHandler from './Modules/ApiKeyHandlers/ApiKeyListHandler.js';

main();

function main() {
    return Promise.all([
        new Promise(res => { new ApiKeyListHandler(); res(); }),
        new Promise(res => { new AddApiKeyFormHandler(); res(); }),
        new Promise(res => { new EditApiKeyFormHandler(); res(); })
    ]);
}