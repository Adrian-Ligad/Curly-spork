require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require("graphql");
const fetch = require("node-fetch");

const GRAPHQL_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";
const OUTPUT_DIR = path.join(__dirname, "..", "src", "graphql");
const SCHEMA_FILE = path.join(OUTPUT_DIR, "schema.graphql");

async function downloadSchema() {
  try {
    // First, make an unauthenticated request to get the schema
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    });

    if (!response.ok) {
      console.log("Attempting to download public schema...");
      // If authentication is required, try the public schema endpoint
      const publicResponse = await fetch(`${GRAPHQL_ENDPOINT}/public-schema`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!publicResponse.ok) {
        throw new Error(`HTTP error! status: ${publicResponse.status}`);
      }

      const publicData = await publicResponse.json();
      if (!publicData.data) {
        throw new Error("Invalid schema data received from public endpoint");
      }
      return publicData;
    }

    const data = await response.json();
    if (!data.data) {
      throw new Error("Invalid schema data received from GraphQL endpoint");
    }
    return data;
  } catch (error) {
    console.error("Error downloading schema:", error);
    console.log("\nTroubleshooting steps:");
    console.log("1. Make sure your backend server is running");
    console.log(
      "2. Verify your GraphQL endpoint is correct:",
      GRAPHQL_ENDPOINT
    );
    console.log("3. Check if your backend has CORS enabled");
    console.log(
      "4. Consider adding a public schema endpoint to your backend\n"
    );
    throw error;
  }
}

async function generateSchema() {
  try {
    console.log("Downloading GraphQL schema...");
    const introspectionResult = await downloadSchema();

    if (!introspectionResult.data && !introspectionResult.__schema) {
      throw new Error("Invalid schema data received");
    }

    const schemaData = introspectionResult.data
      ? introspectionResult.data
      : introspectionResult;
    const schema = buildClientSchema(schemaData);
    const sdl = printSchema(schema);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write schema to file
    fs.writeFileSync(SCHEMA_FILE, sdl);
    console.log("Schema successfully generated at:", SCHEMA_FILE);
  } catch (error) {
    console.error("Error generating schema:", error);
    process.exit(1);
  }
}

generateSchema();
