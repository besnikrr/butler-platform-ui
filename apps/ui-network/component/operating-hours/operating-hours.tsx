import React, { useState, useEffect } from "react";
import { IOperatingHours, TimeRange, WEEK_DAYS } from "@butlerhospitality/shared";
import {
  Grid,
  Row,
  Column,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Select,
  Option,
} from "@butlerhospitality/ui-sdk";
import { getTimeRange } from "../../view/hotel/edit/utils";

const OperatingHours = function ({ category, operatingHours, setOperatingHours }: IOperatingHours): JSX.Element {
  const [timeRange, setTimeRange] = useState<TimeRange[]>([{ content: "", key: "", value: "", disabled: true }]);

  const listOperatingHours = () => {
    return timeRange?.map((time: TimeRange) => (
      <Option value={time?.value} key={time.key}>
        {time?.content}
      </Option>
    ));
  };

  useEffect(() => {
    setTimeRange(getTimeRange());
  }, [category]);

  return (
    <Grid gutter={0}>
      <Row>
        <Column style={{ margin: "5px 0 10px 0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Day</TableCell>
                <TableCell as="th">{category.replace("_", category === "Lunch_Dinner" ? " & " : " ")}</TableCell>
                <TableCell as="th" />
                <TableCell as="th" />
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(WEEK_DAYS).map((day: string, index: number) => {
                const id = (Math.random() * 100 + index).toString();
                return (
                  <TableRow key={id}>
                    <TableCell>
                      <Checkbox
                        checked={operatingHours?.[day]?.isActive && operatingHours?.isAvailable}
                        disabled={!operatingHours?.isAvailable}
                        label={day.slice(0, 3)}
                        onChange={(e: any) => {
                          setOperatingHours(category, day, {
                            isActive: e.target.checked,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell colspan={3}>
                      <div className="ui-flex center v-center">
                        <Select
                          style={{ width: 200 }}
                          value={operatingHours?.[day]?.startTime}
                          disabled={!(operatingHours?.[day]?.isActive && operatingHours?.isAvailable)}
                          selectProps={{
                            onChange: (e: any) => {
                              setOperatingHours(category, day, {
                                startTime: e.target.value,
                              });
                            },
                          }}
                        >
                          {listOperatingHours()}
                        </Select>
                        <Typography className="mx-20" p>
                          to
                        </Typography>
                        <Select
                          style={{ width: 200 }}
                          value={operatingHours?.[day]?.endTime}
                          disabled={!(operatingHours?.[day]?.isActive && operatingHours?.isAvailable)}
                          selectProps={{
                            onChange: (e: any) => {
                              setOperatingHours(category, day, {
                                endTime: e.target.value,
                              });
                            },
                          }}
                        >
                          {listOperatingHours()}
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <br />
        </Column>
      </Row>
    </Grid>
  );
};

export default OperatingHours;
