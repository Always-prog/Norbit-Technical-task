/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useCallback } from 'react';
import { PieChartTransformedProps } from './types';
import Echart from '../components/Echart';
import { EventHandlers } from '../types';
import { onAddFilter } from 'packages/superset-ui-core/src/chart/'
import { changeFilter } from 'src/dashboard/actions/dashboardFilters'
import { createFilterKey } from 'src/dashboard/components/nativeFilters/FilterBar/keyValue'
import { ReloadOutlined } from '@ant-design/icons';


export default function EchartsPie({
  height,
  width,
  echartOptions,
  setDataMask,
  labelMap,
  groupby,
  selectedValues,
  formData,
}: PieChartTransformedProps) {


  const handleChange = useCallback(
    (values: string[]) => {
      if (!formData.emitFilter) {
        return;
      }

      const groupbyValues = values.map(value => labelMap[value]);

      setDataMask({
        extraFormData: {
          filters:
            values.length === 0
              ? []
              : groupby.map((col, idx) => {
                  const val = groupbyValues.map(v => v[idx]);
                  if (val === null || val === undefined)
                    return {
                      col,
                      op: 'IS NULL',
                    };
                  return {
                    col,
                    op: 'IN',
                    val: val as (string | number | boolean)[],
                  };
                }),
        },
        filterState: {
          value: groupbyValues.length ? groupbyValues : null,
          selectedValues: values.length ? values : null,
        },
      });
    },
    [groupby, labelMap, setDataMask, selectedValues],
  );

  const eventHandlers: EventHandlers = {
    click: props => {
      const { name } = props;
      createFilterKey(formData.dashboardId,`{\"NATIVE_FILTER-ARp2Clhf0\":{\"id\":\"NATIVE_FILTER-ARp2Clhf0\",\"extraFormData\":{\"filters\":[{\"col\":\"product_line\",\"op\":\"IN\",\"val\":[\"${name}\"]}]},\"filterState\":{\"validateStatus\":false,\"value\":[\"${name}\"],\"label\":\"${name}\"},\"ownState\":{},\"controlValues\":{\"enableEmptyFilter\":false,\"defaultToFirstItem\":false,\"multiSelect\":true,\"searchAllOptions\":false,\"inverseSelection\":false},\"name\":\"name\",\"filterType\":\"filter_select\",\"targets\":[{\"datasetId\":17,\"column\":{\"name\":\"product_line\"}}],\"defaultDataMask\":{\"extraFormData\":{},\"filterState\":{},\"ownState\":{}},\"cascadeParentIds\":[],\"scope\":{\"rootPath\":[\"ROOT_ID\"],\"excluded\":[]},\"type\":\"NATIVE_FILTER\",\"description\":\"\",\"chartsInScope\":[121],\"tabsInScope\":[\"TAB-d-E0Zc1cTH\"],\"__cache\":{\"validateStatus\":false,\"value\":[\"${name}\"],\"label\":\"${name}\"}}}`, "2")
      window.location.reload();
      const values = Object.values(selectedValues);
      if (values.includes(name)) {
        handleChange(values.filter(v => v !== name));
      } else {
        handleChange([name]);
      }
    },
  };

  return (
    <Echart
      height={height}
      width={width}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
      selectedValues={selectedValues}
    />
  );
}
