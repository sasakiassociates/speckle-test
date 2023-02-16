import { Speckle, SpeckleObject } from '@strategies/speckle';

import SpeckleMagpie from './SpeckleMagpie';


(async () => {
    const stream = (new Speckle()).Stream("6f3acfb477");

    const commit = stream.Commit("152665e775");
    const { referencedObject } = await commit.get;

    const magpie = new SpeckleMagpie(referencedObject, stream);
    // console.log(await magpie.get);
    const programChunks = await magpie.programChunks;
    console.log(await programChunks.get);

    // console.log(await (await magpie.globalProgramData).get);
    // console.log(await thirdLayer.get);

    // const thirdLayerData = await thirdLayer.get;

    // This SpeckleObject mapping will happen inside of a getter on the layer once we know
    // how to define the layer other than 'Third'.
    // const objects = thirdLayerData["@A"].map(row => new SpeckleObject(row.referencedId, stream));
    // console.log(objects);

    // Fetch the objects in the third layer, one-by-one
    // objects.forEach((obj, i) => {
    //     setTimeout(async () => {
    //         console.log(await obj.get);
    //     }, 500 * i);
    // });
})();
