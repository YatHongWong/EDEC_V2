import { beforeEach, afterEach, expect, test ,vi} from 'vitest'
import { parseLog } from "../../src/lib/parseLog"

const OUT_OF_DATE_TIMESTAMP = "2026-07-25T13:19:09Z"
const RECENT_TIMESTAMP = "2026-08-06T13:19:09Z"
const TEST_TIMESTAMP = "2026-08-10T12:00:00Z"

const emptyMaterials = `{ "timestamp":"2026-07-25T13:19:09Z", "event":"Materials", "Raw":[], "Manufactured":[], "Encoded":[] }`

const noMaterialsEvent = `{ "timestamp":"2026-07-25T13:17:07Z", "event":"Fileheader", "part":1, "language":"English/UK", "Odyssey":true, "gameversion":"4.4.0.3", "build":"r330683/r0 " }`

const noMaterialsEventFile = new File([noMaterialsEvent], "Journal.log", {
    type: "text/plain",
})

const invalidFileFormat = new File(["This is not a log file"], "not_a_log.txt", {
    type: "text/plain",
})

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(TEST_TIMESTAMP));
});

afterEach(() => {
    vi.useRealTimers();
});

test('returns error for non-log file', async () => {
    expect(await parseLog(invalidFileFormat))
        .toEqual({ success: false, message: "Invalid file type. Please upload a .log file." })
})

test('returns error for log file with no "Materials" event', async () => {
    expect(await parseLog(noMaterialsEventFile))
        .toEqual({ success: false, message: "No 'Materials' event found in the log file." })
})

test('returns success with empty data for log file with event but no materials, warns user about age of log', async () => {
    const emptyMaterialsFile = createLogFileWithMaterials(OUT_OF_DATE_TIMESTAMP, [], [], []);

    expect(await parseLog(emptyMaterialsFile))
        .toEqual({ success: true, data: { raw: {}, manufactured: {}, encoded: {} }, message: "This log file is older than 7 days. If it's the latest, please ignore this message." })
})

test('returns success with empty data for log file with event but no materials, no warning for recent log', async () => {
    const emptyMaterialsFile = createLogFileWithMaterials(RECENT_TIMESTAMP, [], [], []);

    expect(await parseLog(emptyMaterialsFile))
        .toEqual({ success: true, data: { raw: {}, manufactured: {}, encoded: {} }, message: "" })
})

test('returns success with parsed materials for log file with event and materials, warns user about age of log', async () => {
    const oldMaterialsFile = createLogFileWithMaterials(
        OUT_OF_DATE_TIMESTAMP,
        [{ Name: "Nickel", Count: 10 }],
        [],
        []
    );
    expect(await parseLog(oldMaterialsFile))
        .toEqual({ success: true, data: { raw: { "nickel": 10 }, manufactured: {}, encoded: {} }, message: "This log file is older than 7 days. If it's the latest, please ignore this message." })
})

test('returns success with parsed materials for log file with event and materials, no warning for recent log', async () => {
    const recentMaterialsFile = createLogFileWithMaterials(
        RECENT_TIMESTAMP,
        [{ Name: "Nickel", Count: 10 }],
        [],
        []
    );
    expect(await parseLog(recentMaterialsFile))
        .toEqual({ success: true, data: { raw: { "nickel": 10 }, manufactured: {}, encoded: {} }, message: "" })
})

test('returns success with parsed materials for log file with event and multiple materials', async () => {
    const recentMaterialsFile = createLogFileWithMaterials(
        RECENT_TIMESTAMP,
        [{ Name: "Nickel", Count: 10 }, { Name: "Cobalt", Count: 5 }],
        [{ Name: "Superconductor", Count: 2 }],
        [{ Name: "Encoded Data", Count: 1 }]
    );
    expect(await parseLog(recentMaterialsFile))
        .toEqual({
            success: true,
            data: {
                raw: { "nickel": 10, "cobalt": 5 },
                manufactured: { "superconductor": 2 },
                encoded: { "encodeddata": 1 }
            },
            message: ""
        })
})

test('returns error for log file with invalid JSON', async () => {
    const invalidJsonFile = new File(["{ invalid json }"], "Journal.log", {
        type: "text/plain",
    });

    expect(await parseLog(invalidJsonFile))
        .toEqual({ success: false, message: "Error parsing log file." })
})

function createLogFileWithMaterials(timestamp: string, rawMaterials: { Name: string; Count: number }[], manufacturedMaterials: { Name: string; Count: number }[], encodedMaterials: { Name: string; Count: number }[]): File {
    const logContent = {
        timestamp: timestamp,
        event: "Materials",
        Raw: rawMaterials,
        Manufactured: manufacturedMaterials,
        Encoded: encodedMaterials
    }
    return new File([JSON.stringify(logContent)], "Journal.log", {
        type: "text/plain"
    })
}



