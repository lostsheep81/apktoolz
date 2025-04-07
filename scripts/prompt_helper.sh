#!/bin/bash

# Basic helper script for the Self-Improvement Framework
# Usage:
#   ./scripts/prompt_helper.sh journal  - Interactively create a new journal entry
#   ./scripts/prompt_helper.sh suggest [category] - Suggest prompts (NYI)

# --- Configuration ---
# Get the directory where the script resides
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# Assume the script is in /scripts, so the journal is one level up
JOURNAL_FILE="$SCRIPT_DIR/../SELF_PROMPT_JOURNAL.md"
# Define ANSI color codes for better output
COLOR_RESET='\033[0m'
COLOR_INFO='\033[0;36m' # Cyan
COLOR_PROMPT='\033[1;33m' # Yellow
COLOR_SUCCESS='\033[0;32m' # Green
COLOR_ERROR='\033[0;31m' # Red
COLOR_BOLD='\033[1m'

# --- Function to add a journal entry ---
add_journal_entry() {
    echo -e "${COLOR_INFO}Adding new entry to $JOURNAL_FILE...${COLOR_RESET}"

    # Get today's date
    entry_date=$(date +%F)
    echo -e "${COLOR_INFO}Date: $entry_date${COLOR_RESET}"

    # Get Category
    echo -en "${COLOR_PROMPT}Category (e.g., Testing, Documentation, Workflow): ${COLOR_RESET}"
    read category

    # Get Prompt
    echo -e "${COLOR_PROMPT}Prompt Used (Enter the prompt, use Ctrl+D when done):${COLOR_RESET}"
    prompt_used=$(cat)

    # --- Get Related context ---
    # Attempt to get the latest commit SHA
    latest_sha=$(git -C "$SCRIPT_DIR/.." log -1 --pretty=%H 2>/dev/null) # Run git from repo root

    if [[ -n "$latest_sha" ]]; then
        # Suggest the latest SHA
        echo -en "${COLOR_PROMPT}Related (Commit SHA / Issue # / File Path) [Default: ${latest_sha}]: ${COLOR_RESET}"
        read input_related
        # Use default if user just presses Enter
        related="${input_related:-$latest_sha}"
    else
        # Fallback if git command fails or not in a git repo
        echo -en "${COLOR_PROMPT}Related (Commit SHA / Issue # / File Path / N/A): ${COLOR_RESET}"
        read related
    fi
    # --- End Related context ---

    # Get Insights
    echo -e "${COLOR_PROMPT}Insights Generated (Enter insights, use Ctrl+D when done):${COLOR_RESET}"
    insights=$(cat)

    # Get Actions
    echo -e "${COLOR_PROMPT}Actions Taken (Enter actions, use Ctrl+D when done):${COLOR_RESET}"
    actions=$(cat)

    # Get Effectiveness
    while true; do
        echo -en "${COLOR_PROMPT}Effectiveness (1-5): ${COLOR_RESET}"
        read effectiveness
        # Check if it's a non-empty string containing only digits 1-5
        if [[ -n "$effectiveness" && "$effectiveness" =~ ^[1-5]$ ]]; then
            break
        else
            echo -e "${COLOR_ERROR}Please enter a number between 1 and 5.${COLOR_RESET}"
        fi
    done

    # Get Refinements
    echo -e "${COLOR_PROMPT}Suggested Refinements (Enter refinements, use Ctrl+D when done):${COLOR_RESET}"
    refinements=$(cat)

    # --- Append to Journal ---
    # Use standard Markdown list format for multi-line inputs
    formatted_insights=$(echo "$insights" | sed 's/^/- /')
    formatted_actions=$(echo "$actions" | sed 's/^/- /')
    formatted_refinements=$(echo "$refinements" | sed 's/^/- /')

    {
        echo "" # Add a newline before the entry
        echo "### $entry_date: $category"
        echo ""
        echo "**Prompt Used**:"
        echo '```'
        echo "$prompt_used"
        echo '```'
        echo "**Related**: $related"
        echo "**Insights Generated**:"
        echo "$formatted_insights"
        echo "**Actions Taken**:"
        echo "$formatted_actions"
        echo "**Effectiveness**: $effectiveness"
        echo "**Refinements**:"
        echo "$formatted_refinements"
        echo ""
        echo "---"
    } >> "$JOURNAL_FILE"

    echo -e "${COLOR_SUCCESS}Journal entry added successfully to $JOURNAL_FILE${COLOR_RESET}"
    echo -e "${COLOR_INFO}Consider running 'git add $JOURNAL_FILE'${COLOR_RESET}"
}

# --- Function to suggest prompts (Not Yet Implemented) ---
suggest_prompts() {
    echo -e "${COLOR_INFO}Suggesting prompts...${COLOR_RESET}"
    echo "(Not Yet Implemented)"
    # Future: Could read SELF_PROMPT.md, filter by category,
    # maybe check journal for least recently used prompts.
}


# --- Main Script Logic ---
COMMAND=$1
CATEGORY=$2

# Make sure we are in the script's directory context for git commands if needed
# cd "$SCRIPT_DIR" || exit 1 # Removed as git -C is used

case "$COMMAND" in
    journal)
        add_journal_entry
        ;;
    suggest)
        suggest_prompts "$CATEGORY"
        ;;
    *)
        echo -e "${COLOR_ERROR}Usage: $0 {journal|suggest [category]}${COLOR_RESET}"
        exit 1
        ;;
esac

exit 0
