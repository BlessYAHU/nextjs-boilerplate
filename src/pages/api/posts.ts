import * as level from 'level';
import { NextApiRequest, NextApiResponse } from 'next';

import { fetchPosts, Post } from '../../services/postsService';

interface Response {
  posts: Post[];
}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  console.log('open');
  // 1) Create our database, supply location and options.
  //    This will create or open the underlying store.
  const db = level('my-db');
  try {
    let val;
    db.get('posts', (err, value) => {
      if (err) throw new Error('Ooops! ' + err); // likely the key was not found
      val = value;
      // Ta da!
      console.log('name=' + value);
    });
    if (val) {
      console.log('value: ' + val);
    } else {
      val = await fetchPosts();
      await db.put('posts', JSON.stringify(val));
    }

    res.status(200).json(val); //.json();
  } catch (e) {
    // console.log('error ' + JSON.stringify(e));
    res.status(404).send('error'); //.send(value);//.json();
  } finally {
    db.close();
  }
};
