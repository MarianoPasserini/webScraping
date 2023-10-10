import { readFile } from 'fs/promises';

(async () => {
    // Read the JSON file
    const jsonData = await readFile('catalogoCompraGamer.json', 'utf-8');
    const data = JSON.parse(jsonData);
    console.log(typeof data)
    function filtereProducts(data, allocatedBudget) {
        const filteredProducts = [];
        const socketsDisplayed = [];
        const categories = Object.keys(allocatedBudget);
        categories.forEach(category => {
            data[category].forEach(subcategory => {
                if (subcategory.price <= allocatedBudget[category]) {
                    if ((category.includes("Procesadores")) && !socketsDisplayed.includes(subcategory.specs.Socket)) {
                        socketsDisplayed.push(subcategory.specs.Socket);
                    }

                    if (category.includes("Mothers")) {
                        const socketArr = (subcategory.specs.Socket).split(',');
                        const found = socketsDisplayed.some(socketDisplayed => socketArr.some(socket => socketDisplayed.includes(socket)));
                        if (!found) {
                            return
                        }
                        console.log(`Sockets de la mother: ${subcategory.product} -> ${socketArr}`);
                    }
                    filteredProducts.push(subcategory);
                }
            });
        });
        console.log("sockets used: ", socketsDisplayed);
        return filteredProducts;
    }

    function prioritizeComponents(budget, buildPriorities) {
        // Calculate the allocated budget for each category
        const allocatedBudget = {};
        let remainingBudget = budget;

        for (const category in buildPriorities) {
            const categoryBudget = budget * buildPriorities[category];
            allocatedBudget[category] = Math.min(remainingBudget, categoryBudget);
            remainingBudget -= allocatedBudget[category];
        }

        return allocatedBudget;
    }

    const budget = 500000;
    const amdBuild = {
        "Procesadores AMD": 0.26,
        "Placas de Video Radeon AMD": 0.28,
        "Mothers AMD": 0.17,
        "Fuentes de alimentación": 0.13,
        "Memorias": 0.06,
        "Discos Rígidos": 0.04,
        "Discos Sólidos SSD": 0.06,
        // Add other categories as needed
    };

    const intelBuild = {
        // Define priorities for Intel build
        "Procesadores Intel": 0.24,
        "Placas de Video GeForce": 0.28,
        "Mothers Intel": 0.18,
        "Fuentes de alimentación": 0.14,
        "Memorias": 0.06,
        "Discos Rígidos": 0.04,
        "Discos Sólidos SSD": 0.06,
    };

    const amdAllocatedBudget = prioritizeComponents(budget, amdBuild);
    const intelAllocatedBudget = prioritizeComponents(budget, intelBuild);

    console.log(amdAllocatedBudget);


    const filteredItemsAmd = filtereProducts(data, amdAllocatedBudget);
    console.log(filteredItemsAmd);
    for (let i = 0; i < 4; i++) {
        console.log('=======================================================================================\n')
    }
    const filteredItemsIntel = filtereProducts(data, intelAllocatedBudget);
    console.log(filteredItemsIntel);

})();
