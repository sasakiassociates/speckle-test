import {API, SpeckleNode, SpeckleStream} from '@strategies/speckle';
import {ProgramChunkLayer} from "./ProgramChunkLayer";


export default class MagpieSpeckle extends SpeckleNode<SpeckleStream> {

    public get stream(): SpeckleStream {
        return this.parent;
    }

    protected async fetch() {
        const res = await API.query(
            this.stream.app.server,
            this.stream.app.token,
            `query MagpieQuery($streamId: String!, $id: String!) {
                stream(id: $streamId) {
                    object(id: $id) {
                        data
                    }
                }
            }`,
            {
                id: this.id,
                streamId: this.stream.id,
            }
        );

        return {...res.data.stream.object.data, id: this.id};
    }

    public get globalProgramData(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId("GlobalProgramData"), this);
        })();
    }

    public get globalDocumentData(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId("GlobalDocumentData"), this);
        })();
    }

    public get parcels(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId("Parcels"), this);
        })();
    }

    public get contexts(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId("Contexts"), this);
        })();
    }

    public get programChunks(): Promise<ProgramChunkLayer> {
        return (async () => {
            return new ProgramChunkLayer(await this._getLayerItems("ProgramChunks"), this);
        })();
    }

    private async _getLayerId(layer: string) {
        return (await this.get).Data['@{0}'][0][layer].referencedId;
    }

    private async _getLayerItems(layer : string){
        const res = (await this.get).Data['@{0}'][0];
        console.log(res)
        return (await  this.get).Data['@{0}'][0][layer];
    }

}


class MagpieLayer extends SpeckleNode<MagpieSpeckle> {

    protected async fetch() {
        const res = await API.query(
            this.parent.stream.app.server,
            this.parent.stream.app.token,
            `query MagpieLayerQuery($streamId: String!, $id: String!) {
                stream(id: $streamId) {
                    object(id: $id) {
                        data
                    }
                }
            }`,
            {
                id: this.id,
                streamId: this.parent.stream.id,
            }
        );

        return {...res.data.stream.object.data, id: this.id};
    }

}

