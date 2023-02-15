import { Speckle, SpeckleObject } from '@strategies/speckle';

import SpeckleMagpie from './SpeckleMagpie';


(async () => {
    const stream = (new Speckle()).Stream("6f3acfb477");

    const commit = stream.Commit("f4a6f545ab");
    const { referencedObject } = await commit.get;

    const magpie = new SpeckleMagpie(referencedObject, stream);
    const thirdLayer = await magpie.third;

    console.log(await (await magpie.global).get);
    console.log(await thirdLayer.get);

    const thirdLayerData = await thirdLayer.get;

    // This SpeckleObject mapping will happen inside of a getter on the layer once we know
    // how to define the layer other than 'Third'.
    const objects = thirdLayerData["@A"].map(row => new SpeckleObject(row.referencedId, stream));
    console.log(objects);

    // Fetch the objects in the third layer, one-by-one
    objects.forEach((obj, i) => {
        setTimeout(async () => {
            console.log(await obj.get);
        }, 500 * i);
    });
})();
