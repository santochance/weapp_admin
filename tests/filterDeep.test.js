const filterDeep = require('../src/utils/filterDeep');

const data = [{
  order: 1,
  id: 1,
  title: '导师',
  children: [
    {
      order: 1,
      id: 3,
      title: '导师团3',
      pid: 1,
      objectId: '5a76f79dee920a0045e432a0',
      createdAt: '2018-02-04T12:07:57.021Z',
      updatedAt: '2018-02-06T05:30:58.921Z'
    },
    {
      order: 1,
      content: '',
      title: '导师团2',
      pid: 1,
      id: 7,
      objectId: '5a782214ee920a0058f8fb79',
      createdAt: '2018-02-05T09:21:24.391Z',
      updatedAt: '2018-02-06T05:30:53.708Z'
    },
    {
      order: 1,
      id: 9,
      title: '导师团1',
      pid: 1,
      children: [
        {
          order: 1,
          id: 10,
          title: '导师团子组',
          pid: 9,
          objectId: '5a793de0128fe10037630a03',
          createdAt: '2018-02-06T05:32:16.288Z',
          updatedAt: '2018-02-06T05:34:53.200Z'
        }
      ],
      objectId: '5a793cfea22b9d00448d70a1',
      createdAt: '2018-02-06T05:28:30.179Z',
      updatedAt: '2018-02-06T05:30:20.733Z'
    }
  ],
  objectId: '5a76f70b0b61601d10957009',
  createdAt: '2018-02-04T12:05:31.982Z',
  updatedAt: '2018-02-06T05:27:59.824Z'
},
{
  order: 1,
  id: 2,
  title: '投资人',
  children: [
    {
      order: 1,
      id: 8,
      title: '投资人组1',
      pid: 2,
      objectId: '5a790b0b0b61600038f469d7',
      createdAt: '2018-02-06T01:55:23.699Z',
      updatedAt: '2018-02-06T05:30:46.885Z'
    }
  ],
  objectId: '5a76f73b9f54540071874567',
  createdAt: '2018-02-04T12:06:19.753Z',
  updatedAt: '2018-02-06T05:28:12.588Z'
}];

const filterId = 10;
let rst = filterDeep(data, (item) => item.id !== filterId);
console.log(JSON.stringify(rst, null, 2));

