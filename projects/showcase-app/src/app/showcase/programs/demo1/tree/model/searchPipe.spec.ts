import { TestBed } from '@angular/core/testing';
import { ShowcaseTreeSearchPipe } from './searchPipe';

describe('ShowcaseTreeSearchPipe', () => {
  let srv: ShowcaseTreeSearchPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShowcaseTreeSearchPipe
      ]
    });
    srv = TestBed.inject(ShowcaseTreeSearchPipe);
  });

  it('should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('過濾條件為空字串, 需返回所有資料', () => {
    const filtered = srv.transform(datas,'');
    expect(filtered.length).toEqual(2);
  });
  it('需返回過濾後資料', () => {
    const filtered = srv.transform(datas, 'john');
    expect(filtered[0].name).toEqual('PaPa John');
  });
  it('子節點被查找到, 父節點需出現', () => {
    const filtered = srv.transform(datas, 'brown');
    expect(filtered[0].name).toEqual('PaPa John');
    expect(filtered[1].name).toEqual('Baby Brown');
  });
});
export const datas = [
  {
    'key': 1,
    'name': 'PaPa John',
    'amount': 60,
    'status': true,
    'update': '2016-09-21  08:50:08',
    'address': 'New York No. 1 Lake Park',
    'children': [
      {
        'key': 11,
        'name': 'Baby Brown',
        'amount': 42,
        'status': true,
        'update': '2016-09-21  08:50:08',
        'address': 'New York No. 2 Lake Park'
      }
    ],
    'level': 0,
    'expand': false,
    'checked': false
  },
  {
    'key': 11,
    'name': 'Baby Brown',
    'amount': 42,
    'status': true,
    'update': '2016-09-21  08:50:08',
    'address': 'New York No. 2 Lake Park',
    'level': 1,
    'expand': false,
    'checked': false,
    'parent': {
      'key': 1,
      'name': 'PaPa John',
      'amount': 60,
      'status': true,
      'update': '2016-09-21  08:50:08',
      'address': 'New York No. 1 Lake Park',
      'children': [
        {
          'key': 11,
          'name': 'Baby Brown',
          'amount': 42,
          'status': true,
          'update': '2016-09-21  08:50:08',
          'address': 'New York No. 2 Lake Park'
        }
      ],
      'level': 0,
      'expand': false,
      'checked': false
    }
  }
];
