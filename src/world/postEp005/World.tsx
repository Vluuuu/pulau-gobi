import React from 'react';
import {World005} from '../../episode005/World';
import {Actors005} from '../../episode005/Actors';
import {OUTRO_START} from '../../episode005/timeline.ts';
import {PostEp005School} from './SchoolCampus';
import type {SchoolAssetOptions} from './schoolLayout.ts';

// Final in-world state, before the reused EP004 outro changes the episode scene.
// A fixed pose does not advance an episode clock or mount media/compositions.
export const POST_EP005_REFERENCE_FRAME = OUTRO_START - 1;
export const PostEp005World: React.FC<{school?: SchoolAssetOptions; residents?: boolean}> = ({school, residents = true}) => (
  <group name="post-ep005-world">
    <World005 frame={POST_EP005_REFERENCE_FRAME} schoolOverride={<PostEp005School {...school}/>}/>
    {residents && <Actors005 frame={POST_EP005_REFERENCE_FRAME}/>}
  </group>
);
