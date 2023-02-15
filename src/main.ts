import {API, Speckle, SpeckleNode, SpeckleStream} from '@strategies/speckle';

(async () => {

    const api = new Speckle();

    const stream = api.Stream("6f3acfb477");
    const commit = stream.Commit("f4a6f545ab");
    const data = await commit.get;
    console.log(data);
    const obj = new MagpieSpeckle(data.referencedObject, stream);
    console.log(obj)

    // const global = await obj.global;
    // console.log(global)

    const second = await obj.second;
    console.log(second)

    // const third = await obj.third;
    // console.log(third)
    //
    // const fourth = await obj.fourth;
    // console.log(fourth);

})();

class MagpieSpeckle extends SpeckleNode {
    readonly id: string;
    readonly stream: SpeckleStream;

    constructor(id: string, stream: SpeckleStream) {
        super();
        this.id = id;
        this.stream = stream;
    }

    protected async fetch() {
        const res = await API.query(
            this.stream.app.server,
            this.stream.app.token,
            `query MagieObjectQuery($streamId: String!, $id : String!){
            stream(id: $streamId ){
                object(id: $id){
                children( select: [ "id","BuildingID","ParcelID", "ProgramArea", "ProgramGeometry.speckle_type"] limit:10 depth:2){
                objects{
                  data
        } 
      }
    }
  }
}`,
            {
                id: this.id,
                streamId: this.stream.id,
            }
        );

        return {...res.data.stream.object, id: this.id};
    }

    public get global(): Promise<object> {
        return (async () => {
            return (await this.get).Data["@{0}"][0];
        })()
    }

    public get second(): Promise<object> {
        return (async () => {
            return (await this.get).Data["@{0}"][1];
        })()
    }

    public get third(): Promise<object> {
        return (async () => {
            return (await this.get).Data["@{0}"][2];
        })()
    }

    public get fourth(): Promise<object> {
        return (async () => {
            return (await this.get).Data["@{0}"][3];
        })()
    }

}