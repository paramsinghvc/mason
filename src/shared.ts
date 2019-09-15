const INTERPOLATION_REGEX = /(<%[^%>]+%>)/g;

export const processValue = (value: string, rootState: { [k: string]: any }, selfValue?: string): string => {
  const isInterpolated = INTERPOLATION_REGEX.test(value);
  if (isInterpolated) {
    /**
     * To match the interpolations repetitively
     * "foo<%bar%>baz<%bax%>lorem<%ipsum%>dolor".match(/(<%[^%>]+%>)/g)
     *  => ["<%bar%>", "<%bax%>", "<%ipsum%>"]
     */
    const matchedResults = value.match(INTERPOLATION_REGEX);
    let interpolatedValue = value;
    if (matchedResults) {
      matchedResults.forEach(matchedResult => {
        /**
         * For each of the interpolations matched, the inner valuable text needs to be extracted
         * and processed for finding corresponding value against the field id in the rootState or self
         * eventually replacing the interpolation with the processed value
         * "<%foo%>".match(/^<%([^%>]+)%>$/)
         * => ["<%foo%>", "foo", index: 0, input: "<%foo%>", groups: undefined]
         */
        const extractIdMatch = matchedResult.match(/^<%([^%>]+)%>$/);
        const [fullInterpolatedText, fieldId] = extractIdMatch || ["", ""];
        const processedValue = fieldId === "SELF" ? selfValue : rootState[fieldId] && rootState[fieldId].value;
        interpolatedValue = interpolatedValue.replace(
          fullInterpolatedText,
          typeof processedValue !== "string" ? JSON.stringify(processedValue) : processedValue
        );
      });
    }
    return interpolatedValue;
  }
  return typeof value !== "string" ? JSON.stringify(value) : value;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
