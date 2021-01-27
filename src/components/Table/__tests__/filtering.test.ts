import { rangeFilterer } from '../__mock__/data.mock';
import {
  fieldFiltersPresent,
  filterTableData,
  getSelectedFiltersInitialState,
  isSomeFilterHasValue,
  SelectedFilters,
} from '../filtering';
import { TableRangeFilter } from '../RangeFilter/TableRangeFilter';
import { TableRow } from '../Table';

const FILTERS: SelectedFilters<TableRow> = {
  count: {
    id: 'countFilter',
    field: 'count',
    filterer: rangeFilterer,
    filterComponent: TableRangeFilter,
    value: undefined,
  },
  price: {
    id: 'priceFilter',
    field: 'price',
    filterer: rangeFilterer,
    filterComponent: TableRangeFilter,
    value: undefined,
  },
} as const;

const DATA = [
  {
    id: 'row1',
    count: 150,
    price: 50,
  },
  {
    id: 'row2',
    count: 100,
    price: 150,
  },
  {
    id: 'row3',
    count: 50,
    price: 100,
  },
];

describe('fieldFiltersPresent', () => {
  it('возвращает false если фильтр с таким полем не существует', () => {
    expect(fieldFiltersPresent(FILTERS, 'name')).toEqual(false);
  });

  it('возвращает true если фильтр с таким полем существует', () => {
    expect(fieldFiltersPresent(FILTERS, 'count')).toEqual(true);
  });
});

describe('filterTableData', () => {
  it('возвращает исходные данные, если не выбраны фильтры', () => {
    expect(
      filterTableData({
        data: DATA,
        selectedFilters: FILTERS,
      }),
    ).toEqual(DATA);
  });

  it('не возвращает ничего при фильтрах за пределами данных', () => {
    expect(
      filterTableData({
        data: DATA,
        selectedFilters: {
          price: { ...FILTERS.price, value: { min: '9000', max: undefined } },
          count: { ...FILTERS.count, value: { min: undefined, max: '-100' } },
        } as SelectedFilters<TableRow>,
      }),
    ).toEqual([]);
  });

  it('фильтрует по одной строке', () => {
    expect(
      filterTableData({
        data: DATA,
        selectedFilters: {
          price: { ...FILTERS.price, value: { min: 100, max: 100 } },
        } as SelectedFilters<TableRow>,
      }),
    ).toEqual([DATA[2]]);
  });

  it('фильтрует по двум строкам', () => {
    expect(
      filterTableData({
        data: DATA,
        selectedFilters: {
          count: { ...FILTERS.count, value: { min: 100, max: 100 } },
          price: { ...FILTERS.price, value: { min: 150, max: 150 } },
        } as SelectedFilters<TableRow>,
      }),
    ).toEqual([DATA[1]]);
  });
});

describe('getSelectedFiltersInitialState', () => {
  it('возвращает пустой список фильтров и их значений, если ничего не было передано', () => {
    expect(getSelectedFiltersInitialState()).toEqual({});
  });

  it('возвращает начальное состояние для каждого типа фильтра', () => {
    expect(getSelectedFiltersInitialState(FILTERS)).toEqual({
      count: FILTERS.count,
      price: FILTERS.price,
    });
  });
});

describe('isSomeFilterHasValue', () => {
  it('возвращает false если не выбран ни один фильтр', () => {
    expect(
      isSomeFilterHasValue({
        count: FILTERS.count,
        price: FILTERS.price,
      }),
    ).toEqual(false);
  });

  it('возвращает true если выбран фильтр для одного из полей', () => {
    expect(
      isSomeFilterHasValue({
        count: FILTERS.count,
        price: { ...FILTERS.price, value: { min: '10', max: undefined } },
      }),
    ).toEqual(true);
  });

  it('возвращает true если выбраны фильтры для всех полей', () => {
    expect(
      isSomeFilterHasValue({
        count: { ...FILTERS.count, value: { min: '40', max: '100' } },
        price: { ...FILTERS.price, value: { min: '10', max: undefined } },
      }),
    ).toEqual(true);
  });
});
