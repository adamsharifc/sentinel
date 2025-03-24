import json
import re
import os

def determine_resource_types(rule, is_tracking_rule=False):
    """
    Determine appropriate resource types based on rule analysis
    """
    # Handle specific types from filter syntax
    if "$image" in rule:
        return ["image"]
    elif "$script" in rule:
        return ["script"]
    elif "$stylesheet" in rule:
        return ["stylesheet"]
    elif "$subdocument" in rule:
        return ["sub_frame"]
    elif "$xmlhttprequest" in rule:
        return ["xmlhttprequest"]
    elif "$ping" in rule:
        return ["ping"]
    elif "$font" in rule:
        return ["font"]
    
    # Check file extensions
    if rule.endswith(".js") or ".js?" in rule:
        return ["script"]
    elif rule.endswith(".css") or ".css?" in rule:
        return ["stylesheet"]
    
    # For image extensions, be more selective
    image_exts = [".gif", ".png", ".jpg", ".jpeg"]
    if any(rule.endswith(ext) or f"{ext}?" in rule for ext in image_exts):
        # Only block images that match tracking patterns
        tracking_patterns = ["pixel", "beacon", "track", "pxl", "1x1", "analytics", 
                            "counter", "count.gif", "tracker", "telemetry", "ping"]
        if any(pattern in rule.lower() for pattern in tracking_patterns):
            return ["image"]
        # If it's specifically from the tracking list, still block
        if is_tracking_rule:
            return ["image"]
        # Otherwise, don't block general images
        return ["script", "xmlhttprequest"]  # Block other resources instead
    
    # Check content indicators
    if "tracking" in rule.lower() or "analytics" in rule.lower():
        if is_tracking_rule:
            # Include "image" only for obvious tracking pixel patterns
            if any(pattern in rule.lower() for pattern in ["pixel", "beacon", "1x1"]):
                return ["script", "xmlhttprequest", "ping", "image"]
            return ["script", "xmlhttprequest", "ping"]
    
    # For ad patterns, be careful with images
    if "/ads/" in rule or "/ad/" in rule:
        # Only include image for clear ad image patterns
        if any(pattern in rule.lower() for pattern in ["banner", "advert", "promo"]):
            return ["script", "image", "stylesheet", "sub_frame"]
        return ["script", "stylesheet", "sub_frame"]
    
    # Default resource types based on rule type
    if is_tracking_rule:
        # For tracking rules, only include image for known tracking pixel domains
        tracking_domains = ["analytics", "tracker", "metric", "telemetry", "pixel"]
        if any(domain in rule.lower() for domain in tracking_domains):
            return ["script", "xmlhttprequest", "ping", "beacon", "image", "other"]
        # Otherwise exclude image by default for tracking rules
        return ["script", "xmlhttprequest", "ping", "beacon", "other"]
    else:
        # For ad rules, be conservative with images to avoid breaking sites
        return ["sub_frame", "stylesheet", "script", "xmlhttprequest", "ping", "media"]

def should_skip_rule(line):
    """
    Determine if a rule should be skipped due to complexity or potential breakage
    """
    # Skip element hiding rules (contain ##)
    if "##" in line:
        return True
    
    # Skip exception rules (starting with @@)
    if line.startswith("@@"):
        return True
    
    # Skip rules with complex modifiers we can't translate well
    complex_modifiers = ["$popup", "$third-party", "$generichide", "##", "#@#", "#?#"]
    if any(mod in line for mod in complex_modifiers):
        return True
    
    return False

def process_domains(rule):
    """
    Extract domain information from a rule
    """
    domain_part = ""
    include_domains = []
    exclude_domains = []
    
    # Check for domain= syntax
    if "$domain=" in rule:
        domain_part = rule.split("$domain=")[1].split(",")[0]
        domains = domain_part.split("|")
        for domain in domains:
            if domain.startswith("~"):
                exclude_domains.append(domain[1:])
            else:
                include_domains.append(domain)
    
    return include_domains, exclude_domains

def process_file(input_file_path, output_file_prefix, max_rules_per_file, start_id, is_tracking_file=False):
    # Initialize the list to hold the rules
    rules = []
    rule_id = start_id
    file_index = 1
    skipped_rules = 0

    # Create output directory
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
    os.makedirs(output_dir, exist_ok=True)

    # Read the input file
    with open(input_file_path, 'r') as file:
        lines = file.readlines()

    # Process each line in the input file
    for line in lines:
        line = line.strip()
        
        # Skip comments, empty lines, and complex rules
        if line.startswith('!') or line == '' or should_skip_rule(line):
            continue
            
        # Store the original line for reference
        original_line = line
            
        # Determine resource types based on rule
        resource_types = determine_resource_types(line, is_tracking_rule=is_tracking_file)
        
        # Extract domains to include/exclude
        include_domains, exclude_domains = process_domains(line)
        
        # Clean up the rule by removing modifiers
        if "$" in line:
            rule_part = line.split("$")[0]
            # Skip if cleaning results in empty rule
            if not rule_part.strip():
                skipped_rules += 1
                continue
            line = rule_part
        
        condition = {"resourceTypes": resource_types}
        
        # Set up the condition
        if line.startswith('||'):
            # Domain match
            cleaned_rule = line.replace('||', '')
            # Skip if cleaning results in empty rule
            if not cleaned_rule.strip():
                skipped_rules += 1
                continue
            condition['urlFilter'] = cleaned_rule
        elif line.startswith('/'):
            # Regular expression match
            try:
                # Process regex pattern
                regex_pattern = line[1:-1] if line.endswith('/') else line[1:]
                
                # Skip if pattern is empty
                if not regex_pattern.strip():
                    skipped_rules += 1
                    continue
                    
                # Don't automatically escape all periods - some may be intentional wildcards
                # Instead, only escape periods that are likely literal
                for pattern in [r'\.com', r'\.net', r'\.org', r'\.edu', r'\.gov']:
                    regex_pattern = regex_pattern.replace(pattern, pattern.replace('.', '\\.'))
                
                if not regex_pattern.startswith('^'):
                    regex_pattern = '^' + regex_pattern
                
                # Validate regex pattern
                re.compile(regex_pattern)
                condition['regexFilter'] = regex_pattern
            except re.error:
                # If regex is invalid, use it as a plain urlFilter
                if not line.strip():
                    skipped_rules += 1
                    continue
                condition['urlFilter'] = line
        elif line.startswith('.'):
            # Subdomain match
            if not line[1:].strip():
                skipped_rules += 1
                continue
            condition['urlFilter'] = line[1:]
        else:
            # Default to urlFilter
            if not line.strip():
                skipped_rules += 1
                continue
            condition['urlFilter'] = line
        
        # Verify we have a non-empty filter
        if ('urlFilter' in condition and not condition['urlFilter']) or \
           ('regexFilter' in condition and not condition['regexFilter']):
            skipped_rules += 1
            continue
        
        # Add domain conditions if present
        if include_domains:
            condition['domainType'] = 'firstParty'
            condition['domains'] = include_domains
        if exclude_domains:
            # Skip rules with excludes for now, they're complex to translate properly
            skipped_rules += 1
            continue

        # Create the rule
        rule = {
            'id': rule_id,
            'priority': 1,
            'action': {'type': 'block'},
            'condition': condition
        }
        rules.append(rule)
        rule_id += 1

        # Check if the current file has reached the maximum number of rules
        if len(rules) >= max_rules_per_file:
            # Write the rules to the output JSON file
            output_file_path = os.path.join(output_dir, f"{output_file_prefix}{file_index}.json")
            with open(output_file_path, 'w') as json_file:
                json.dump(rules, json_file, separators=(',', ':'))
            print(f'Generated {len(rules)} rules in {output_file_path}')
            
            # Reset the rules list and increment the file index
            rules = []
            file_index += 1

    # Write any remaining rules to a new file
    if rules:
        output_file_path = os.path.join(output_dir, f"{output_file_prefix}{file_index}.json")
        with open(output_file_path, 'w') as json_file:
            json.dump(rules, json_file, separators=(',', ':'))
        print(f'Generated {len(rules)} rules in {output_file_path}')
    
    print(f'Skipped {skipped_rules} rules that would have resulted in empty filters')

# Process the files with appropriate flags
process_file('tracking-systems.txt', 'tracking_rules_', 30000, 1, True)
process_file('advert_blocking.txt', 'advert_rules_', 30000, 100000, False)
