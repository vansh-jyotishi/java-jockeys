package com.javajockeys.java_jockeys.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.concurrent.TimeUnit;

@RestController
@CrossOrigin
public class WebCompilerController {
     private static final int TIME_LIMIT = 3; // seconds

    @PostMapping("/compile")
    public String compileAndRun(@RequestBody String code) {

        File dir = new File("temp");
        dir.mkdir();

        try {
            //1Write code to file
            File sourceFile = new File(dir, "Main.java");
            try (FileWriter writer = new FileWriter(sourceFile)) {
                writer.write(code);
            }

            //2️Compile
            Process compileProcess =
                    new ProcessBuilder("javac", sourceFile.getAbsolutePath())
                            .redirectErrorStream(true)
                            .start();

            compileProcess.waitFor();

            if (compileProcess.exitValue() != 0) {
                return readStream(compileProcess.getInputStream());
            }

            //3️Run with TIMEOUT
            Process runProcess =
                    new ProcessBuilder("java", "-cp", dir.getAbsolutePath(), "Main")
                            .redirectErrorStream(true)
                            .start();

            boolean finished =
                    runProcess.waitFor(TIME_LIMIT, TimeUnit.SECONDS);

            //4️Timeout handling
            if (!finished) {
                runProcess.destroyForcibly();
                return "❌ Time Limit Exceeded (Possible infinite loop)";
            }

            return readStream(runProcess.getInputStream());

        } catch (Exception e) {
            return "❌ Error: " + e.getMessage();
        } finally {
            deleteFiles(dir);
        }
    }

    //Read output
    private String readStream(InputStream stream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder output = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        return output.toString();
    }

    //Cleanup
    private void deleteFiles(File dir) {
        for (File file : dir.listFiles()) {
            file.delete();
        }
        dir.delete();
    }
}
