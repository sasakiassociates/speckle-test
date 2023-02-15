import { API, SpeckleNode, SpeckleStream } from '@strategies/speckle';


export default class MagpieSpeckle extends SpeckleNode<SpeckleStream> {
    
    public get stream(): SpeckleStream {
        return this.parent;
    }

    protected async fetch() {
        const res =  await API.query(
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

        return { ...res.data.stream.object.data, id: this.id };
    }

    public get global(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId(0), this);
        })();
    }

    public get second(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId(1), this);
        })();
    }

    public get third(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId(2), this);
        })();
    }

    public get fourth(): Promise<object> {
        return (async () => {
            return new MagpieLayer(await this._getLayerId(3), this);
        })();
    }

    private async _getLayerId(layer: number) {
        return (await this.get).Data['@{0}'][layer].referencedId;
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

        return { ...res.data.stream.object.data, id: this.id };
    }

}
