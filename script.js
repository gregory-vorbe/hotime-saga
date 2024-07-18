let req = indexedDB.open("/idbfs", 21);
req.onsuccess = (event)=>{
    let db = req.result; 
    let os = db.transaction(['FILE_DATA'], "readwrite").objectStore('FILE_DATA');
    os.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if(cursor){
            if (cursor.key.includes('PlayerPrefs')) {
                let contents = cursor.value.contents;
                //console.log("==>"+contents);
                let money_uint8 = new TextEncoder().encode("money");
                //console.log("==>"+ money_uint8);
                let startIndex = -1;
                for (let i = 0; i < contents.length; i++) {
                    if (contents[i] === money_uint8[0]) {
                        let found = true;
                        for (let j = 1; j < money_uint8.length; j++) {
                            if (contents[i + j] !== money_uint8[j]) {
                                found = false;
                                break;
                            }
                        }
                        if (found) {
                            startIndex = i;
                            break;
                        }
                    }
                }
                if (startIndex !== -1) {
                    contents[startIndex+money_uint8.length+1] = 255;
                    contents[startIndex+money_uint8.length+2] = 255;
                    contents[startIndex+money_uint8.length+3] = 255;
                    cursor.value.contents = contents;
                    let ru = os.put(cursor.value, cursor.key);
                    ru.onsuccess = () => {
                        console.log('save game updated!')
                    }
                }
                //return;
            }
            cursor.continue();
        }
    }
    db.close();
};
