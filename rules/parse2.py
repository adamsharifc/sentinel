import re
import json
import argparse

def parse_fanboys_to_dnr(input_file, output_file):
    """
    Convert a fanboys-style filter list to DNR format
    """
    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith('!')]
    
    rules = []
    rule_id = 1
    
    for line in lines:
        # Skip element hiding rules and comments
        if '##' in line or line.startswith('#'):
            continue
            
        # Determine if this is an exception rule
        is_exception = line.startswith('@@')
        if is_exception:
            line = line[2:]  # Remove @@ prefix
            
        # Extract options after $ if present
        options = {}
        if '$' in line:
            base_rule, options_text = line.split('$', 1)
            for opt in options_text.split(','):
                if '=' in opt:
                    key, value = opt.split('=', 1)
                    options[key] = value
                else:
                    options[opt] = True
        else:
            base_rule = line
            
        # Determine resource types
        resource_types = ["main_frame"]  # Default
        if 'stylesheet' in options:
            resource_types = ["stylesheet"]
        elif 'script' in options:
            resource_types = ["script"]
        elif 'image' in options:
            resource_types = ["image"]
        elif 'xmlhttprequest' in options or 'xhr' in options:
            resource_types = ["xmlhttprequest"]
        elif 'document' in options:
            resource_types = ["main_frame", "sub_frame"]
        elif 'subdocument' in options:
            resource_types = ["sub_frame"]
            
        # Determine action type
        if is_exception:
            action = {"type": "allow"}
        elif "redirect" in options:
            redirect_url = f"https://example.com"  # Default redirect URL
            action = {"type": "redirect", "redirect": {"url": redirect_url}}
        else:
            action = {"type": "block"}
            
        # Determine priority (higher for 'important' rules)
        priority = 2 if 'important' in options else 1
        
        # Clean up the URL filter
        url_filter = base_rule
        
        # Skip rules with empty URL filters
        if not url_filter:
            continue
        
        # Create the DNR rule
        dnr_rule = {
            "id": rule_id,
            "priority": priority,
            "action": action,
            "condition": {
                "urlFilter": url_filter,
                "resourceTypes": resource_types
            }
        }
        
        rules.append(dnr_rule)
        rule_id += 1
    
    # Write the rules to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(rules, f, indent=2)
        
    print(f"Converted {len(rules)} rules to DNR format in {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert fanboys filter list to DNR format')
    parser.add_argument('input_file', help='Path to input filter list file')
    parser.add_argument('output_file', help='Path to output JSON file')
    args = parser.parse_args()
    
    parse_fanboys_to_dnr(args.input_file, args.output_file)