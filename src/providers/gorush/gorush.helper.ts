/**
 * Converts Prometheus text-based metrics to JSON
 */
export const parseMetrics = (metricsText: string): Record<string, any> => {
  const metrics: Record<string, any> = {};

  const lines = metricsText.split('\n');
  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) {
      continue; // Skip comments and empty lines
    }

    const [key, value] = line.split(/\s+/);
    if (!key || !value) continue;

    // Handle labels inside {}
    const labelMatch = key.match(/(.+)\{(.+)\}/);
    if (labelMatch) {
      const metricName = labelMatch[1];
      const labelString = labelMatch[2];
      const labels: Record<string, string> = {};

      labelString.split(',').forEach((pair) => {
        const [k, v] = pair.split('=');
        labels[k] = v.replace(/"/g, '');
      });

      metrics[metricName] = { value: parseFloat(value), labels };
    } else {
      metrics[key] = parseFloat(value);
    }
  }

  return metrics;
};
