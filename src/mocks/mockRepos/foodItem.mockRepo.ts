import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';
import { BaseMockRepository } from './baseMockRepo';
import { randomUUID } from 'crypto';

export class foodItemMockRepository extends BaseMockRepository<FoodItem> {
  constructor() {
    super(
      Promise.resolve([
        {
          id: randomUUID(),
          name: 'Idli',
          price: 20,
          image:
            'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/idli-recipe.jpg',
        },
        {
          id: randomUUID(),
          name: 'Dosa',
          price: 60,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/8/8f/Rameshwaram_Cafe_Dosa.jpg',
        },
        {
          id: randomUUID(),
          name: 'Poori',
          price: 50,
          image:
            'https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2013/11/poori-picture_thumb3.jpg?ssl=1',
        },
        {
          id: randomUUID(),
          name: 'Veg Meals',
          price: 120,
          image:
            'https://content.jdmagicbox.com/comp/bhubaneshwar/k2/0674px674.x674.220401013250.w2k2/catalogue/pure-veg-meals-by-lunchbox-chandrasekharpur-bhubaneshwar-pure-veg-restaurants-rsotuaxg9y.jpg',
        },
        {
          id: randomUUID(),
          name: 'Parotta',
          price: 80,
          image:
            'https://images.news18.com/ibnlive/uploads/2022/06/malabar-paratha.jpg',
        },
      ]),
    );
  }
}
