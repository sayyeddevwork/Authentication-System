# for creating all the folder structure at once on bash terminal

#!/bin/bash

# Define the directories to create

directories=(
"src/config"
"src/constants"
"src/controllers"
"src/middlewares"
"src/routes"
"src/utils"
"src/validations"
)

# Define the files to create

files=(
"src/config/env.ts"
"src/config/logger.ts"
"src/constants/httpStatusCodes.ts"
"src/constants/errorCodes.ts"
"src/constants/messages.ts"
"src/middlewares/errorHandler.ts"
"src/middlewares/notFoundHandler.ts"
"src/middlewares/validate.ts"
"src/routes/health.route.ts"
"src/routes/index.ts"
"src/utils/AppError.ts"
"src/utils/asyncHandler.ts"
"src/validations/health.validation.ts"
"src/app.ts"
"src/server.ts"
)

echo "🚀 Starting architecture setup..."

# 1. Create directories if they don't exist

for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
echo " ➜ Directory already exists: $dir (Skipping)"
  else
    mkdir -p "$dir"
echo " ✔ Created directory: $dir"
fi
done

echo "--------------------------------------"

# 2. Create files if they don't exist

for file in "${files[@]}"; do
  if [ -e "$file" ]; then
echo " ➜ File already exists: $file (Skipping)"
  else
    touch "$file"
echo " ✔ Created file: $file"
fi
done

echo "🎉 Architecture setup completed successfully!"
