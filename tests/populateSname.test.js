const populateSname = require('../src/utils/populateSname');

const sortList = [{
  id: 0,
  title: 'item 0',
  pid: undefined,
},
{
  id: 1,
  title: 'item 1',
  pid: 0,
},
{
  id: 2,
  title: 'item 2',
  pid: 0,
},
{
  id: 3,
  title: 'item 3',
  pid: 1,
},
{
  id: 4,
  title: 'item 4',
  pid: 2,
},
{
  id: 5,
  title: 'item 5',
  pid: undefined,
},
{
  id: 6,
  title: 'item 6',
  pid: 5,
}];

const dataSource = [
  { sort: 0 },
  { sort: 2 },
  { sort: 4 },
  { sort: 4 },
  { sort: 2 },
];
const output = populateSname(dataSource, sortList);

console.log('output:', JSON.stringify(output, null, 2));

