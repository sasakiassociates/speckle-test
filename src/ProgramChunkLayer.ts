import {API, SpeckleNode} from '@strategies/speckle';
import MagpieSpeckle from "./SpeckleMagpie";

export type ProgramChunk = {
    BuildingId: string;
    ParcelId: string;
    ProgramId: string;
    ProgramArea: number;
    ProgramTags: ProgramTag[]
}

export type ProgramTag = {}

export class ProgramChunkLayer extends SpeckleNode<MagpieSpeckle, ProgramChunk> {

    protected async fetch() {
        console.log("fetching program chunks")
        const res = await API.query(
            this.parent.stream.app.server,
            this.parent.stream.app.token,
            `query MagpieQuery($streamId: String!, $id: String!) {
             stream(id: $streamId) {
                object(id: $id) {
                  children(
                    select: ["ProgramChunks.ParcelID", "ProgramChunks.ProgramID", "ProgramChunks.BuildingID", "ProgramChunks.ProgramArea", "ProgramChunks.ProgramTags"]
                    limit: 100
                    depth: 100
                  ) {
                    objects {
                      data
                    }
                  }
                }
              }
            }`,
            {
                id: this.id,
                streamId: this.parent.stream.id,
            }
        );

        return {...res.data, id: this.id};
    }

}