import { readFile } from 'fs/promises';

(async () => {
  // Read the JSON file
  const jsonData = await readFile('output.json', 'utf-8');
  const data = JSON.parse(jsonData);

  function filterProductsByAllocatedBudget(data, allocatedBudget) {
    const filteredProducts = [];
  
    // Iterate through each main category
    data.forEach(mainCategory => {
      const mainCategoryName = Object.keys(mainCategory)[0];
      const subcategories = mainCategory[mainCategoryName];
  
      // Iterate through each subcategory in the main category
      subcategories.forEach(subcategory => {
        const subcategoryName = Object.keys(subcategory)[0];
        const products = subcategory[subcategoryName];
  
        // Filter products based on the allocated budget for the subcategory
        const filteredProductsInSubcategory = products.filter(product => {
          const productPrice = product.price || 0; // Handle cases where price is null
          return productPrice <= allocatedBudget[mainCategoryName];
        });
  
        // If there are filtered products in the subcategory, add them to the result array
        if (filteredProductsInSubcategory.length > 0) {
          filteredProducts.push({
            category: mainCategoryName,
            subcategory: subcategoryName,
            products: filteredProductsInSubcategory,
          });
        }
      });
    });
  
    return filteredProducts;
  }



  function prioritizeComponents(budget) {
    // Define the priorities
    const priorities = {
      "Procesadores": 0.24,
      "Placas de Video": 0.28,
      "Mothers": 0.18,
      "Fuentes": 0.13,
      "Memorias RAM": 0.06,
      "Almacenamiento": 0.06,
      "Gabinetes": 0.05,
    };
    
    // Calculate the allocated budget for each component
    const allocatedBudget = {};
    let remainingBudget = budget;
    
    Object.entries(priorities).forEach(([component, importance]) => {
      const componentBudget = budget * importance;
      allocatedBudget[component] = Math.min(remainingBudget, componentBudget);
      remainingBudget -= allocatedBudget[component];
    });
  
    return allocatedBudget;
  }
  
  const budget = 500000;
  const result = prioritizeComponents(budget);
  const filteredProducts = filterProductsByAllocatedBudget(data, result);
  
  console.log(JSON.stringify(filteredProducts, null, 2));
  console.log(result);

})();