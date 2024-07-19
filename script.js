findIndex = (a1, a2) => {
    let startIndex = -1;
    for (let i = 0; i < a1.length; i++) {
      if (a1[i] === a2[0]) {
        let found = true;
        for (let j = 1; j < a2.length; j++) {
          if (a1[i + j] !== a2[j]) {
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
    //console.log('index: ' + startIndex);
    return startIndex;
}
let req = indexedDB.open("/idbfs", 21);
req.onsuccess = (event)=>{
    let db = req.result; 
    let os = db.transaction(['FILE_DATA'], "readwrite").objectStore('FILE_DATA');
    os.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if(cursor){
            if (cursor.key.includes('PlayerPrefs')) {
                let contents = cursor.value.contents;
                let has_changed = false;
                //console.log("==>"+contents);
                const money_uint8 = new TextEncoder().encode("money");
                //console.log("==>"+ money_uint8);
                index = findIndex(contents, money_uint8);
                if (index !== -1) {
                    has_changed = true;
                    contents[index+money_uint8.length+1] = 255;
                    contents[index+money_uint8.length+2] = 255;
                    contents[index+money_uint8.length+3] = 255;
                }

                // Disabled: can cause a game crash 
                /*const food1_uint8 = new TextEncoder().encode("foodAmount1");
                index = findIndex(contents, food1_uint8);
                if (index !== -1) {
                    has_changed = true;
                    contents[index+food1_uint8.length+1] = 255;
                }

                const food2_uint8 = new TextEncoder().encode("foodAmount2");
                index = findIndex(contents, food2_uint8);
                if (index !== -1) {
                    has_changed = true;
                    contents[index+food2_uint8.length+1] = 255;
                }

                const battery_uint8 = new TextEncoder().encode("battery");
                index = findIndex(contents, battery_uint8);
                if (index !== -1) {
                    has_changed = true;
                    contents[index+battery_uint8.length+1] = 10;
                }

                const exp_uint8 = new TextEncoder().encode("_exp");
                index = findIndex(contents, exp_uint8);
                if (index !== -1) {
                    has_changed = true;
                    contents[index+exp_uint8.length+1] = 10;
                }*/

                if(has_changed){
                    cursor.value.contents = contents;
                    let ru = os.put(cursor.value, cursor.key);
                    ru.onsuccess = () => {
                        console.log('save game updated!')
                    }
                }
            }
            cursor.continue();
        }
    }
    db.close();
};
