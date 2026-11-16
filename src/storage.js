export class StorageController {
    static get(key, fromJSON) {
        const storage = localStorage.getItem(key);
        const data = storage ? JSON.parse(storage) : [];

        return data.map(fromJSON);
    }

    static add(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    static remove(key, id, fromJSON) {
        const data = StorageController.get(key, fromJSON);

        if (data) {
            const newData = data.filter((element) => element.id !== id);
            StorageController.add(key, newData);
        }
    }
}